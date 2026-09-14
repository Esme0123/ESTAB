export function numeroALetras(monto) {
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const diezEspeciales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const cientos = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const entero = Math.floor(monto);
  const centavos = Math.round((monto - entero) * 100).toString().padStart(2, '0');

  if (entero === 0) return `CERO CON ${centavos}/100 BOLIVIANOS`;

  function convertirGrupo(n) {
    let output = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (n === 100) return 'CIEN ';
    if (c > 0) output += cientos[c] + ' ';

    if (d === 1) {
      output += diezEspeciales[u] + ' ';
    } else if (d > 0) {
      output += decenas[d] + (u > 0 ? ' Y ' + unidades[u] : '') + ' ';
    } else if (u > 0) {
      output += unidades[u] + ' ';
    }
    return output;
  }

  let letras = '';
  const millones = Math.floor(entero / 1000000);
  const miles = Math.floor((entero % 1000000) / 1000);
  const resto = entero % 1000;

  if (millones > 0) {
    letras += (
      millones === 1 ? 'UN MILLON ' : convertirGrupo(millones).trim() + ' MILLONES '
    );
  }
  if (miles > 0) {
    letras += miles === 1 ? 'UN MIL ' : convertirGrupo(miles).trim() + ' MIL ';
  }
  if (resto > 0) {
    letras += convertirGrupo(resto);
  }

  return `${letras.trim()} CON ${centavos}/100 BOLIVIANOS`;
}