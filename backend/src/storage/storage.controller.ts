import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('vault/:clientBusinessName')
  async getFolders(@Param('clientBusinessName') clientBusinessName: string) {
    return this.storageService.listClientFolders(clientBusinessName);
  }

  @Post('upload')
  async uploadFile(
    @Body('clientBusinessName') clientBusinessName: string,
    @Body('folder') folder: string,
    @Body('filename') filename: string,
    @Body('fileContentBase64') fileContentBase64: string,
  ) {
    return this.storageService.saveUploadedFile(
      clientBusinessName,
      folder,
      filename,
      fileContentBase64,
    );
  }
}
