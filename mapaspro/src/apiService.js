/**
 * Verifica si un nombre de usuario está registrado en usuarios.json.
 * @param {string} name - El nombre del usuario a verificar.
 * @returns {Promise<boolean>} - Una promesa que resuelve a true si el usuario está registrado, false si no.
 */
export async function checkUserRegistration(name) {
  try {
    const response = await fetch('/usuarios.json'); // Busca en la carpeta 'public'

    // Verifica si la respuesta de la red fue exitosa
    if (!response.ok) {
      throw new Error(`Error de red al cargar usuarios: ${response.statusText}`);
    }

    const listaDeUsuarios = await response.json(); // Convierte la respuesta a JSON

    // Devuelve true si el nombre está en la lista, false si no
    return listaDeUsuarios.includes(name);

  } catch (error) {
    console.error("Error en checkUserRegistration:", error);
    // Relanza el error para que el componente que llama lo maneje
    throw error; 
  }
}