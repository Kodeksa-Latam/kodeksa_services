import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

/**
 * Servicio para manejar las interacciones con Cloudinary
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // Configuración de Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Sube un archivo a Cloudinary
   * @param file Archivo a subir
   * @param folder Carpeta donde se guardará el archivo en Cloudinary
   * @returns URL del archivo subido
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'resumes'): Promise<string> {
    return new Promise((resolve, reject) => {
      // Crear un stream de subida a Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto', // Detecta automáticamente el tipo de archivo
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Nombre único
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Error al subir archivo a Cloudinary: ${error.message}`, error);
            return reject(error);
          }
          resolve(result!.secure_url);
        }
      );

      // Convertir el buffer del archivo a stream y pasarlo al stream de subida
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Elimina un archivo de Cloudinary
   * @param publicId ID público del archivo en Cloudinary
   * @returns Resultado de la eliminación
   */
  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar archivo de Cloudinary: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   * @param url URL completa de Cloudinary
   * @returns Public ID del recurso
   */
  getPublicIdFromUrl(url: string): string {
    const splitUrl = url.split('/');
    const filenameWithExtension = splitUrl[splitUrl.length - 1];
    const filename = filenameWithExtension.split('.')[0];
    const folder = splitUrl[splitUrl.length - 2];
    return `${folder}/${filename}`;
  }
}