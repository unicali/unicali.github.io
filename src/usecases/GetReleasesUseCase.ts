import type { AppVersion } from '../domain/Release';
import { VERSIONS_DATA } from '../data/releases';

export class GetVersionsUseCase {
  static getAll(): AppVersion[]                      { return VERSIONS_DATA; }
  static getLatest(): AppVersion                     { return VERSIONS_DATA[0]; }
  static getById(id: string): AppVersion | undefined { return VERSIONS_DATA.find(v => v.id === id); }
}
