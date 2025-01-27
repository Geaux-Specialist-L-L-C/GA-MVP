<template>
  <div>
    <h3>Curriculum Approval</h3>
    <ul>
      <li v-for="item in curriculum" :key="item.id">
        <div>
          <h4>{{ item.subject }}</h4>
          <p>{{ item.content }}</p>
          <button @click="approve(item.id)">Approve</button>
          <button @click="reject(item.id)">Reject</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  props: {
    curriculum: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async approve(id) {
      try {
        await api.post(`/api/curriculum/approve`, { id });
        alert('Curriculum approved');
      } catch (error) {
        console.error('Error approving curriculum:', error);
      }
    },
    async reject(id) {
      try {
        await api.post(`/api/curriculum/reject`, { id });
        alert('Curriculum rejected');
      } catch (error) {
        console.error('Error rejecting curriculum:', error);
      }
    },
  },
};
</script>
