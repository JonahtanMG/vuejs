<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const estudiante = ref(null)
const cursos = ref([])
const fecha = ref('')

onMounted(async () => {
  try {
    const cui = route.params.cui

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
    console.error(error)
  }
})
</script>

<template>
  <div class="container" v-if="estudiante">

    <div class="header">
      <h1>CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>
      <h2>Escuela Profesional de Ingeniería de Sistemas EPIS</h2>

      <p class="fecha">
        Emitido el: {{ fecha }}
      </p>
    </div>

    <hr>

    <div class="section-title">
      DATOS DEL ALUMNO
    </div>

    <table class="student-table">
      <tr>
        <td class="label">C.U.I.:</td>
        <td>{{ estudiante.cui }}</td>
      </tr>

      <tr>
        <td class="label">Nombre completo:</td>
        <td>{{ estudiante.full_name }}</td>
      </tr>

      <tr>
        <td class="label">Email:</td>
        <td>{{ estudiante.email }}</td>
      </tr>
    </table>

    <div class="section-title">
      ASIGNATURAS MATRICULADAS
    </div>

    <table class="courses-table">
      <thead>
        <tr>
          <th>N°</th>
          <th>Código</th>
          <th>Curso</th>
          <th>Año</th>
          <th>Grupo</th>
          <th>Laboratorio</th>
          <th>Docente</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(curso, index) in cursos"
          :key="curso.id"
        >
          <td>{{ index + 1 }}</td>

          <td>
            {{ curso.workload.course.code }}
          </td>

          <td>
            <strong>
              {{ curso.workload.course.name }}
            </strong>
            <br>
            ({{ curso.workload.course.acronym }})
          </td>

          <td>
            {{ curso.workload.course.year_display }}
          </td>

          <td>
            {{ curso.workload.group }}
          </td>

          <td>
            {{ curso.workload.laboratory }}
          </td>

          <td>
            {{ curso.workload.teacher.full_name }}
          </td>
        </tr>
      </tbody>
    </table>

    <p class="total">
      Total de cursos matriculados:
      {{ cursos.length }}
    </p>

    <p class="footer">
      Documento generado digitalmente por el Sistema de Matrícula de Laboratorio EPIS.
    </p>

  </div>
</template>

<style scoped>

.container {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;
}

.header {
  text-align: center;
}

.header h1 {
  color: #1b4e81;
  font-size: 34px;
  margin-bottom: 5px;
}

.header h2 {
  margin-top: 0;
  color: #444;
}

.fecha {
  margin-top: 20px;
  color: #777;
}

.section-title {
  margin-top: 30px;
  margin-bottom: 10px;
  padding: 10px;
  background: #f0f0f0;
  border-left: 5px solid #123d6a;
  font-weight: bold;
  font-size: 24px;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.student-table td {
  padding: 12px 8px;
}

.label {
  width: 250px;
  font-weight: bold;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th {
  background: #f3f3f3;
  text-align: left;
}

.courses-table th,
.courses-table td {
  border: 1px solid #ccc;
  padding: 12px;
}

.total {
  margin-top: 30px;
  font-size: 24px;
  font-weight: bold;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #999;
  font-style: italic;
}

</style>