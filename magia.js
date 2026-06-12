document.addEventListener("DOMContentLoaded", () => {
  const btnVerNotas = document.getElementById("btn-ver-notas");
  const introScreen = document.getElementById("intro-screen");
  const gameScreen = document.getElementById("game-screen");
  const aliens = document.querySelectorAll(".alien");
  const hitboxes = document.querySelectorAll(".hitbox");
  
  // Capturamos nuestro nuevo visor personalizado
  const crosshair = document.getElementById("custom-crosshair");

  // 🔊 AUDIO 1: Configuración del sonido de fondo
  const audioFondo = new Audio("./audio/campo_tiro_2.mp3");
  audioFondo.volume = 0.4; // Volumen al 40% para que no tape el disparo ni sature

  // 🔊 AUDIO 2: Configuración del efecto de disparo
  const audioDisparo = new Audio("./audio/disparo.mp3");
  audioDisparo.volume = 0.7;

  btnVerNotas.addEventListener("click", () => {
    introScreen.style.opacity = "0";
    
    // 🔊 AUDIO: Arrancar la música de fondo al interactuar con el botón
    audioFondo.play().catch(error => {
      console.log("El navegador bloqueó el audio momentáneamente:", error);
    });
    
    setTimeout(() => {
      introScreen.style.display = "none";
      gameScreen.classList.remove("screen-hidden");
      gameScreen.classList.add("screen-visible");
      
      // ACTIVAR EL VISOR: Solo aparece cuando entramos al campo de tiro
      crosshair.style.display = "block";

      setTimeout(() => {
        aliens.forEach(alien => {
          alien.classList.add("spawned");
        });
      }, 800);

    }, 1800);
  });

  // LOGICA DEL CURSOR PERSONALIZADO
  // Seguir las coordenadas del ratón en tiempo real
  window.addEventListener("mousemove", (e) => {
    crosshair.style.left = e.clientX + "px";
    crosshair.style.top = e.clientY + "px";
  });

  // 🔊 AUDIO: Evento global de disparo en el escenario
  // Esto asegura que suene pinches donde pinches dentro del juego
  gameScreen.addEventListener("click", () => {
    // Clonamos el nodo antes de reproducir para permitir ráfagas de tiros rápidos
    const clonDisparo = audioDisparo.cloneNode();
    clonDisparo.volume = audioDisparo.volume;
    clonDisparo.play();
  });

  // Mapa de notas por ID de alien
  const notas = {
    "alien-angular":    { asignatura: "Inglés",           puntuacion: "10" },
    "alien-ingles":     { asignatura: "Angular",            puntuacion: "10" },
    "alien-servidor":   { asignatura: "Servidor",          puntuacion: "9.8" },
    "alien-cliente":    { asignatura: "Cliente",           puntuacion: "9.4" },
    "alien-despliegue": { asignatura: "Despliegue Apps",   puntuacion: "9.6" },
    "alien-interfaces": { asignatura: "D. Interfaces",     puntuacion: "9.4" },
    "alien-ipe2":       { asignatura: "IPE2",              puntuacion: "9.8" },
  };

  // Inyectar el div de nota neón dentro de cada alien
  aliens.forEach(alien => {
    const datos = notas[alien.id];
    if (!datos) return;

    const nota = document.createElement("div");
    nota.classList.add("nota-neon");
    nota.innerHTML = `
      <div class="asignatura">${datos.asignatura}</div>
      <div class="puntuacion">${datos.puntuacion}</div>
    `;
    alien.appendChild(nota);
  });

  // Detectar cuando el cursor entra en la zona de disparo (hitbox del tronco)
  hitboxes.forEach(hitbox => {
    hitbox.addEventListener("mouseenter", () => {
      crosshair.classList.add("targeting");
    });

    hitbox.addEventListener("mouseleave", () => {
      crosshair.classList.remove("targeting");
    });

    // DISPARO: click sobre el hitbox
    hitbox.addEventListener("click", (e) => {
      // Evitamos que el click del hitbox se duplique con el del escenario global
      e.stopPropagation();
      
      // 🔊 AUDIO: Al hacer stopPropagation, el click global no se entera, así que forzamos el disparo aquí
      const clonDisparo = audioDisparo.cloneNode();
      clonDisparo.volume = audioDisparo.volume;
      clonDisparo.play();

      const alien = hitbox.closest(".alien");
      if (!alien) return;

      // Tiffany: se pone roja Y abre el diálogo (solo una vez)
      if (alien.id === "alien-real") {
        alien.classList.add("shot");
        document.getElementById("tiffany-dialog").classList.add("visible");
        return;
      }

      // Aliens normales: solo dispara una vez (si ya está muerto, ignorar)
      if (alien.classList.contains("shot")) return;
      alien.classList.add("shot");
    });
  });

  // Cerrar el diálogo de Tiffany
  document.getElementById("tiffany-close").addEventListener("click", () => {
    document.getElementById("tiffany-dialog").classList.remove("visible");
  });

  // Reiniciar: recarga la página desde cero
  document.getElementById("tiffany-restart").addEventListener("click", () => {
    location.reload();
  });
});