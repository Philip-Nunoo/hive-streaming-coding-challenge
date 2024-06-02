import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_ID_FILE } from '../config';

export class ClientIdService {
  static getClientId(): string {
    if (fs.existsSync(CLIENT_ID_FILE)) {
      return fs.readFileSync(CLIENT_ID_FILE, 'utf8');
    } else {
      const clientId = uuidv4();
      fs.writeFileSync(CLIENT_ID_FILE, clientId);
      return clientId;
    }
  }
}
