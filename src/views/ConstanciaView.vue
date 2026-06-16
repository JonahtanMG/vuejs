<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const estudiante = ref(null)
const cursos = ref([])
const fecha = ref('')

onMounted(async () => {
  try {

    const params = new URLSearchParams(window.location.search)

    const cui = params.get('cui') || '20250100'

    const response = await axios.get(
      `https://sisacad-enrollments-backend.vercel.app/restful/enrollment-certificate/?cui=${cui}`
    )

    const data = response.data.results

    if (data.length > 0) {

      estudiante.value = data[0].student
      cursos.value = data

      fecha.value = new Date().toLocaleDateString('es-PE')

    }

  } catch (error) {

    console.error('Error al consumir API:', error)

  }
})
</script>
