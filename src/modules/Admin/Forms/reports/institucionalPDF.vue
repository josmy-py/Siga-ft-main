<script setup>
const emit = defineEmits(["cerrar"]);
</script>

<template>

  <div class="page-wrap">
    <button
      @click="emit('cerrar')"
      class="absolute top-4 left-4 border border-transparent bg-transparent px-3 py-2 border rounded"
    >
      <i class="pi pi-times text-white"></i>
    </button>

    <div class="pdf">

      <!-- HEADER -->
      <header class="header">

        <!-- LOGO (AGREGADO) -->
        <div style="margin-bottom:10px;">
          <img
            src="/public/LogoDefi.jpeg"
            alt="Logo Institucional"
            style="width:70px;height:70px;object-fit:contain;margin:0 auto;"
          />
        </div>

        <h1>REPORTE INSTITUCIONAL</h1>
        <p>Documento oficial de gestión académica</p>
        <span class="meta">Fecha: 15/06/2026 · Nivel: Bachillerato</span>
      </header>

      <!-- 1. IDENTIFICACIÓN -->
      <section>
        <h2>1. Identificación del Reporte</h2>
        <div class="grid-2">
          <div><strong>Nivel:</strong> Bachillerato</div>
          <div><strong>Fecha:</strong> 15/06/2026</div>
        </div>
      </section>

      <!-- 2. DATOS DEL DIRECTOR -->
      <section>
        <h2>2. Datos del Director</h2>
        <div class="grid-3">
          <div><strong>Nombre:</strong> Carlos Martínez</div>
          <div><strong>Cargo:</strong> Director</div>
          <div><strong>Correo:</strong> director@inst.edu</div>
        </div>
      </section>

      <!-- 3. RENDIMIENTO ACADÉMICO -->
      <section>
        <h2>3. Rendimiento Académico</h2>

        <table class="table">
          <tr>
            <td>Total de Estudiantes</td>
            <td class="val">850</td>
          </tr>
          <tr>
            <td>Promedio General</td>
            <td class="val">8.7</td>
          </tr>
          <tr>
            <td>Estudiantes Destacados</td>
            <td class="val">120</td>
          </tr>
        </table>

        <p class="text">
          El rendimiento académico se mantiene estable, con una leve mejora en el promedio general
          respecto al periodo anterior, reflejando un desempeño institucional sólido.
        </p>
      </section>

      <!-- 4. CONDUCTA Y DISCIPLINA -->
      <section>
        <h2>4. Conducta y Disciplina</h2>

        <div class="grid-2">
          <div><strong>Incidentes:</strong> 12</div>
          <div><strong>Leves:</strong> 8</div>
          <div><strong>Graves:</strong> 2</div>
          <div><strong>Medidas:</strong> 10</div>
        </div>

        <p class="text">
          El control disciplinario se mantiene dentro de parámetros aceptables con baja incidencia de casos graves.
        </p>
      </section>

      <!-- 5. ACTIVIDADES INSTITUCIONALES -->
      <section>
        <h2>5. Actividades Institucionales</h2>

        <ul class="list">
          <li>Participación en acto cívico institucional</li>
          <li>Desarrollo de feria científica con proyectos estudiantiles</li>
          <li>Realización de torneo deportivo interclases</li>
          <li>Actividad cultural con enfoque artístico y social</li>
        </ul>

        <div class="grid-2 mt">
          <div><strong>Total Actividades:</strong> 14</div>
          <div><strong>Total Proyectos:</strong> 6</div>
        </div>

        <p class="text">
          Las actividades fortalecieron la convivencia escolar y la participación estudiantil.
        </p>
      </section>

      <!-- 6. CONTROL ESCOLAR -->
      <section>
        <h2>6. Control Escolar</h2>
        <div class="grid-3">
          <div><strong>Matrícula:</strong> 920</div>
          <div><strong>Nuevos Ingresos:</strong> 140</div>
          <div><strong>Reprobados:</strong> 35</div>
        </div>
      </section>

      <!-- 7. RECURSOS HUMANOS -->
      <section>
        <h2>7. Recursos Humanos</h2>
        <div class="grid-2">
          <div><strong>Docentes:</strong> 45</div>
          <div><strong>Ausentes:</strong> 2</div>
        </div>
      </section>

      <!-- 8. OBSERVACIONES GENERALES -->
      <section>
        <h2>8. Observaciones Generales</h2>
        <p class="text">
          El periodo evaluado presenta estabilidad institucional con mejoras progresivas en rendimiento y organización.
        </p>
      </section>

      <!-- FIRMA -->
      <div class="firma">
        ___________________________<br>
        Firma del Director
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  background: #d4d4d4;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.pdf {
  width: 794px;
  min-height: 1123px;
  background: white;
  padding: 55px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, .25);
  border: 1px solid #cfcfcf;
  color: #222;
}

/* HEADER */
.header {
  text-align: center;
  border-bottom: 1px solid #999;
  padding-bottom: 18px;
  margin-bottom: 25px;
}

.header h1 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: .5px;
}

.header p {
  font-size: 12px;
  color: #555;
}

.meta {
  font-size: 11px;
  color: #777;
  display: block;
  margin-top: 5px;
}

/* SECCIONES */
section {
  margin-bottom: 20px;
}

h2 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: #333;
}

/* GRIDS */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 13px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  font-size: 13px;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 10px;
}

.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.val {
  text-align: right;
  font-weight: 600;
}

/* LIST */
.list {
  font-size: 13px;
  padding-left: 18px;
  color: #333;
}

.list li {
  margin-bottom: 6px;
}

/* TEXTO */
.text {
  margin-top: 10px;
  font-size: 12px;
  color: #444;
  line-height: 1.5;
}

/* FIRMA */
.firma {
  margin-top: 40px;
  text-align: right;
  font-size: 12px;
  color: #333;
}

/* MARGEN TOP */
.mt {
  margin-top: 10px;
}
</style>
