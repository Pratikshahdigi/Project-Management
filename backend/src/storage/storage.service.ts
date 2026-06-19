import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly vaultRoot = path.join(__dirname, '..', 'client_vault');

  constructor() {
    if (!fs.existsSync(this.vaultRoot)) {
      fs.mkdirSync(this.vaultRoot, { recursive: true });
    }
  }

  // Automatically creates client vault directory structures
  initializeClientDirectory(clientBusinessName: string): string[] {
    const safeName = clientBusinessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const clientPath = path.join(this.vaultRoot, safeName);

    const standardFolders = [
      'Design',
      'Video',
      'Document',
      'Report',
      'Contract',
    ];

    const createdFolders = [];
    if (!fs.existsSync(clientPath)) {
      fs.mkdirSync(clientPath, { recursive: true });
    }

    for (const folder of standardFolders) {
      const folderPath = path.join(clientPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        createdFolders.push(path.join(safeName, folder));
      }
    }

    console.log(`[STORAGE VAULT] Directory initialized for client: ${clientBusinessName}. Structure: ${standardFolders.join(', ')}`);
    return createdFolders;
  }

  listClientFolders(clientBusinessName: string) {
    const safeName = clientBusinessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const clientPath = path.join(this.vaultRoot, safeName);
    
    if (!fs.existsSync(clientPath)) {
      this.initializeClientDirectory(clientBusinessName);
    }

    // List folder contents
    const folders = fs.readdirSync(clientPath);
    const details = [];

    for (const folder of folders) {
      const folderPath = path.join(clientPath, folder);
      const stat = fs.statSync(folderPath);
      if (stat.isDirectory()) {
        const files = fs.readdirSync(folderPath);
        details.push({
          name: folder,
          path: `/vault/${safeName}/${folder}`,
          filesCount: files.length,
          files: files.map(file => {
            const filePath = path.join(folderPath, file);
            const fileStat = fs.statSync(filePath);
            return {
              name: file,
              sizeBytes: fileStat.size,
              createdAt: fileStat.birthtime,
            };
          }),
        });
      }
    }

    return details;
  }

  async saveUploadedFile(clientBusinessName: string, folder: string, filename: string, fileContentBase64: string) {
    const safeName = clientBusinessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const destDir = path.join(this.vaultRoot, safeName, folder);

    if (!fs.existsSync(destDir)) {
      throw new BadRequestException(`Folder directory '/${folder}' does not exist for client.`);
    }

    const destPath = path.join(destDir, filename);
    const buffer = Buffer.from(fileContentBase64.split(',')[1] || fileContentBase64, 'base64');
    
    fs.writeFileSync(destPath, buffer);
    console.log(`[STORAGE VAULT] File saved successfully: ${destPath}`);

    return {
      fileName: filename,
      path: `/vault/${safeName}/${folder}/${filename}`,
      sizeBytes: buffer.length,
    };
  }
}
