import { readFile } from 'node:fs/promises';

export async function cargarArreglo<T>(archivo: string): Promise<T[]> {
  const contenido = await readFile(archivo, 'utf8');
  const datos: unknown = JSON.parse(contenido);
  if (!Array.isArray(datos)) throw new Error(`El archivo ${archivo} debe contener un arreglo.`);
  return datos as T[];
}
