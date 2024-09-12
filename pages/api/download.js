// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from 'node-fetch';
import Archiver from 'archiver';

export default async  function handler(req, res) {
    // List of remote files
    const { url } = req.body
    try {
      const response = await fetch(url);
      
      // Ensure the request was successful
      if (!response.ok) {
          res.status(500).json({ error: 'Failed to download file' });
          return;
      }

      // Set headers for downloading
      res.setHeader('Content-Type', 'application/zip'); // Adjust the MIME type based on your file type
      res.setHeader('Content-Disposition', 'attachment; filename="MerchFile.zip"'); // Set the filename

      // Stream the file to the response
      response.body.pipe(res);
  } catch (error) {
      res.status(500).json({ error: 'Error downloading file' });
  }
}