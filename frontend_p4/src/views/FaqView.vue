<script setup>
const faqs = [
  {
    question: '¿Qué puedo hacer en esta aplicación?',
    answer:
      'Puedes descubrir canciones, buscar temas por título y completar las palabras que faltan mientras se reproduce la letra.'
  },
  {
    question: '¿Necesito iniciar sesión para usarla?',
    answer:
      'No siempre. Algunas funciones pueden usarse como visitante, pero al iniciar sesión se guarda más información sobre tu actividad y tu progreso.'
  },
  {
    question: '¿Cómo encuentro una canción concreta?',
    answer:
      'Desde la página principal puedes usar el buscador por título. Los resultados incluyen enlaces directos a la vista de cada canción.'
  },
  {
    question: '¿Qué significa que una canción sea popular?',
    answer:
      'La aplicación muestra como populares las canciones con más reproducciones, usando el valor de veces que han sido reproducidas.'
  },
  {
    question: '¿Qué ocurre en la página de canciones?',
    answer:
      'En esa vista puedes escuchar la canción y escribir las palabras omitidas en la letra. Es la parte principal de la aplicación.'
  },
  {
    question: '¿Puedo obtener una canción al azar?',
    answer:
      'Sí. En la página de inicio hay una opción para mostrar una canción elegida aleatoriamente y acceder a ella en un solo paso.'
  },
  {
    question: '¿Qué pasa al cerrar sesión?',
    answer:
      'Se elimina tu identificación de la sesión actual y la aplicación te redirige para confirmar que has salido correctamente del sistema.'
  }
]
</script>

<template>
  <PageShell width="default">
    <h1>FAQ</h1>
    <ul>
      <li v-for="faq in faqs" :key="faq.question">
        <h2>{{ faq.question }}</h2>
        <p>{{ faq.answer }}</p>
      </li>
    </ul>
  </PageShell>
</template>
