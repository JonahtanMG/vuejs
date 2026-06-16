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
      `/api/restful/enrollment-certificate/?cui=${cui}`
    )

    console.log(response.data)

    const data = response.data.results

    if (data && data.length > 0) {

      estudiante.value = data[0].student
      cursos.value = data

    }

    fecha.value = new Date().toLocaleDateString('es-PE')

  } catch (error) {

    console.error(error)

  }
})
</script>

<template>

<div class="container">

  <div class="header">

    <h1>CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>

    <h2>
      Escuela Profesional de Ingeniería de Sistemas EPIS
    </h2>

    <p class="fecha">
      Fecha de emisión: {{ fecha }}
    </p>

  </div>

  <div v-if="estudiante">

    <div class="section-title">
      DATOS DEL ESTUDIANTE
    </div>

    <table class="student-table">

      <tr>
        <td class="label">C.U.I.</td>
        <td>{{ estudiante.cui }}</td>
      </tr>

      <tr>
        <td class="label">Nombre Completo</td>
        <td>{{ estudiante.full_name }}</td>
      </tr>

      <tr>
        <td class="label">Correo Electrónico</td>
        <td>{{ estudiante.email }}</td>
      </tr>

    </table>

    <div class="section-title">
      ASIGNATURAS MATRICULADAS
    </div>

    <table class="courses-table">

      <thead>
        <tr>
          <th>#</th>
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
          v-for="(curso,index) in cursos"
          :key="curso.id"
        >

          <td>{{ index + 1 }}</td>

          <td>
            {{ curso.workload.course.code }}
          </td>

          <td>
            {{ curso.workload.course.name }}
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

    <div class="summary">
      Total de cursos matriculados: {{ cursos.length }}
    </div>

  </div>

  <div v-else class="loading">

    Cargando constancia...

  </div>

</div>

</template>

<style scoped>

.container{
  max-width:1100px;
  margin:auto;
  padding:25px;
  font-family:Arial, Helvetica, sans-serif;
}

.header{
  text-align:center;
  margin-bottom:30px;
}

.header h1{
  color:#154c79;
  margin-bottom:5px;
}

.header h2{
  color:#444;
  font-size:20px;
  margin-top:0;
}

.fecha{
  color:#777;
}

.section-title{
  background:#f0f0f0;
  border-left:5px solid #154c79;
  padding:12px;
  margin-top:25px;
  margin-bottom:10px;
  font-size:20px;
  font-weight:bold;
}

.student-table{
  width:100%;
  margin-bottom:25px;
}

.student-table td{
  padding:10px;
}

.label{
  width:220px;
  font-weight:bold;
}

.courses-table{
  width:100%;
  border-collapse:collapse;
}

.courses-table th{
  background:#154c79;
  color:white;
}

.courses-table th,
.courses-table td{
  border:1px solid #ccc;
  padding:10px;
}

.courses-table tr:nth-child(even){
  background:#f7f7f7;
}

.summary{
  margin-top:20px;
  font-size:18px;
  font-weight:bold;
}

.loading{
  text-align:center;
  margin-top:50px;
  font-size:20px;
}

</style>
