<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Parent Dashboard</h1>
      <notification-center />
    </header>

    <nav class="dashboard-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['nav-btn', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main class="dashboard-content">
      <progress-tracker 
        v-if="activeTab === 'progress'"
        :student-data="studentData"
      />
      <curriculum-approval 
        v-if="activeTab === 'curriculum'"
        :curriculum-data="curriculumData"
      />
      <learning-insights 
        v-if="activeTab === 'insights'"
        :learning-data="learningData"
      />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import NotificationCenter from './NotificationCenter.vue'
import ProgressTracker from './ProgressTracker.vue'
import CurriculumApproval from './CurriculumApproval.vue'
import LearningInsights from './LearningStyleInsights.vue'

export default {
  name: 'ParentDashboard',
  
  components: {
    NotificationCenter,
    ProgressTracker,
    CurriculumApproval,
    LearningInsights
  },

  setup() {
    const activeTab = ref('progress')
    const studentData = ref(null)
    const curriculumData = ref(null)
    const learningData = ref(null)

    const tabs = [
      { id: 'progress', label: 'Progress' },
      { id: 'curriculum', label: 'Curriculum' },
      { id: 'insights', label: 'Learning Insights' }
    ]

    const setActiveTab = (tabId) => {
      activeTab.value = tabId
    }

    onMounted(async () => {
      // Fetch initial data
      try {
        const response = await fetch('https://learn.geaux.app/api/students')
        studentData.value = await response.json()
      } catch (error) {
        console.error('Error fetching student data:', error)
      }
    })

    return {
      activeTab,
      studentData,
      curriculumData,
      learningData,
      tabs,
      setActiveTab
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 4rem; /* Add extra padding at the bottom */
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
}

.dashboard-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>