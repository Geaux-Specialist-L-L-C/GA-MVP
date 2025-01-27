<template>
  <div class="learning-insights">
    <div class="insights-header">
      <h2>Learning Style Profile</h2>
      <span class="last-updated">Last updated: {{ formatDate(lastAssessment) }}</span>
    </div>

    <div class="chart-section">
      <radar-chart :chart-data="radarData" :options="chartOptions" />
    </div>

    <div class="styles-grid">
      <div v-for="(score, style) in learningStyles" 
           :key="style" 
           class="style-card"
           :class="`style-${style}`">
        <h3>{{ formatStyleName(style) }}</h3>
        <div class="score-bar">
          <div class="score-fill" :style="{ width: `${score}%` }"></div>
        </div>
        <p class="score-value">{{ score }}%</p>
      </div>
    </div>

    <div class="recommendations">
      <h3>Personalized Recommendations</h3>
      <div class="recommendations-grid">
        <div v-for="(rec, index) in recommendations" 
             :key="index" 
             class="recommendation-card">
          <i :class="rec.icon"></i>
          <h4>{{ rec.title }}</h4>
          <p>{{ rec.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Radar as RadarChart } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default defineComponent({
  name: 'LearningStyleInsights',
  components: { RadarChart },

  data() {
    return {
      lastAssessment: new Date(),
      learningStyles: {
        visual: 75,
        auditory: 60,
        reading: 85,
        kinesthetic: 45
      },
      recommendations: [
        {
          title: 'Visual Learning',
          description: 'Use mind maps and diagrams',
          icon: 'fas fa-eye'
        },
        {
          title: 'Reading/Writing',
          description: 'Take detailed notes and summaries',
          icon: 'fas fa-book'
        },
        {
          title: 'Auditory',
          description: 'Record and listen to lectures',
          icon: 'fas fa-headphones'
        }
      ]
    }
  },

  computed: {
    radarData() {
      return {
        labels: Object.keys(this.learningStyles).map(this.formatStyleName),
        datasets: [{
          label: 'Learning Style Profile',
          data: Object.values(this.learningStyles),
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          borderColor: 'rgba(66, 165, 245, 1)',
          pointBackgroundColor: 'rgba(66, 165, 245, 1)'
        }]
      }
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true
          }
        }
      }
    }
  },

  methods: {
    formatStyleName(style: string): string {
      return style.charAt(0).toUpperCase() + style.slice(1)
    },
    
    formatDate(date: Date): string {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date)
    }
  }
})
</script>

<style scoped>
.learning-insights {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-section {
  height: 300px;
  margin-bottom: 2rem;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.style-card {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--light-bg);
}

.score-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 1rem 0;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.recommendation-card {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--light-bg);
  text-align: center;
}

.recommendation-card i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}
</style>