<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const estudiante = ref(null)
const cursos = ref([])
const fecha = ref('')

const cargando = ref(true)
const mensajeError = ref('')

onMounted(async () => {

  try {

    const params = new URLSearchParams(window.location.search)

    const cui = params.get('cui')

  if (!cui) {
    mensajeError.value = 'Debe proporcionar un CUI en la URL.'
    cargando.value = false
    return
  }

    const response = await axios.get(
      `/api/restful/enrollment-certificate/?cui=${cui}`
    )

    const data = response.data.results

    if (data && data.length > 0) {

      estudiante.value = data[0].student
      cursos.value = data

    } else {

      mensajeError.value =
        `No se encontraron matrículas registradas para el CUI: ${cui}`

    }

    fecha.value = new Date().toLocaleDateString('es-PE')

  } catch (error) {

    console.error(error)

    mensajeError.value =
      'Ocurrió un error al consultar la constancia.'

  } finally {

    cargando.value = false

  }

})
</script>

<template>
  <div class="page-bg">
    <div class="document">

      <!-- ENCABEZADO -->
      <div class="header">
        <h1 class="title">CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>
        <h2 class="subtitle">Escuela Profesional de Ingeniería de Sistemas EPIS</h2>
        <p class="fecha">Emitido el: {{ fecha }}</p>
        <hr class="divider" />
      </div>

     <div v-if="cargando" class="loading">
  Cargando datos de la constancia...
</div>

<div v-else-if="mensajeError" class="error-message">
  {{ mensajeError }}
</div>

<div v-else-if="estudiante">

  <!-- DATOS DEL ALUMNO -->
  <div class="section-header">DATOS DEL ALUMNO</div>
  <table class="info-table">
    <tr>
      <td class="info-label">C.U.I.:</td>
      <td class="info-value">{{ estudiante.cui }}</td>
    </tr>
    <tr>
      <td class="info-label">Nombre completo:</td>
      <td class="info-value highlight">{{ estudiante.full_name }}</td>
    </tr>
    <tr>
      <td class="info-label">Email:</td>
      <td class="info-value highlight">{{ estudiante.email }}</td>
    </tr>
  </table>

  <!-- ASIGNATURAS -->
  <div class="section-header">ASIGNATURAS MATRICULADAS</div>
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
      <tr v-for="(curso, index) in cursos" :key="curso.id">
        <td class="center blue-bold">{{ index + 1 }}</td>
        <td class="center">{{ curso.workload.course.code }}</td>
        <td>
          <span class="course-name">{{ curso.workload.course.name }}</span>
          <span v-if="curso.workload.course.abbreviation" class="course-abbr">
            ({{ curso.workload.course.abbreviation }})
          </span>
        </td>
        <td class="center">{{ curso.workload.course.year_display }}</td>
        <td class="center">{{ curso.workload.group }}</td>
        <td class="center blue-bold">{{ curso.workload.laboratory }}</td>
        <td>{{ curso.workload.teacher.full_name }}</td>
      </tr>
    </tbody>
  </table>

  <div class="summary">
    <strong>Total de cursos matriculados:</strong> {{ cursos.length }}
  </div>

  <p class="footer-note">
    Documento generado digitalmente por el Sistema de Matrícula de Laboratorio EPIS.
  </p>

</div>

      <div v-else class="loading">
        Ingrese un CUI en la URL.
        <br>
        Ejemplo:
        <br>
        ?cui=20250100
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Fondo gris de página */
.page-bg {
  min-height: 100vh;
  background-color: #eef0f3;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: border-box;
}

/* Documento blanco con sombra */
.document {
  background: #ffffff;
  max-width: 900px;
  width: 100%;
  padding: 40px 45px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  box-sizing: border-box;
}

/* Encabezado */
.header {
  text-align: center;
  margin-bottom: 8px;
}

.title {
  color: #154c79;
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 6px 0;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #333;
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 6px 0;
}

.fecha {
  color: #888;
  font-size: 13px;
  margin: 0 0 18px 0;
}

.divider {
  border: none;
  border-top: 2px solid #154c79;
  margin: 0 0 24px 0;
}

/* Encabezado de sección: fondo gris con borde izquierdo azul */
.section-header {
  background-color: #e8e8e8;
  border-left: 5px solid #154c79;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: bold;
  color: #222;
  letter-spacing: 0.5px;
  margin-bottom: 0;
}

/* Tabla de datos del alumno */
.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.info-table tr td {
  padding: 9px 14px;
  font-size: 14px;
  vertical-align: middle;
}

.info-label {
  font-weight: bold;
  color: #222;
  width: 200px;
}

.info-value {
  color: #222;
}

.info-value.highlight {
  color: #154c79;
}

/* Tabla de cursos */
.courses-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  margin-bottom: 0;
}

.courses-table thead tr {
  background-color: transparent;
}

.courses-table th {
  color: #222;
  padding: 10px 10px;
  text-align: left;
  font-weight: bold;
  font-size: 13.5px;
  border: 1px solid #d0d0d0;
  background-color: transparent;
}

.courses-table td {
  padding: 9px 10px;
  border: 1px solid #d0d0d0;
  color: #222;
  vertical-align: middle;
}

.courses-table tbody tr:nth-child(even) {
  background-color: #f7f7f7;
}

.center {
  text-align: center;
}

.blue-bold {
  color: #154c79;
  font-weight: bold;
}

.course-name {
  display: block;
  font-weight: bold;
  color: #222;
}

.course-abbr {
  display: block;
  color: #2980b9;
  font-size: 12.5px;
}

/* Resumen */
.summary {
  margin-top: 18px;
  font-size: 14px;
  color: #222;
}

/* Pie de página */
.footer-note {
  margin-top: 24px;
  text-align: center;
  font-style: italic;
  color: #999;
  font-size: 12px;
}

/* Loading */
.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #777;
}
  .error-message {
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #f5c2c7;
  background: #f8d7da;
  color: #842029;
  border-radius: 6px;
  font-size: 18px;
}

.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #555;
}
</style>
