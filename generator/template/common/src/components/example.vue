<template>
  <div>
    <a
      href="https://www.vexipui.com/components/"
      target="_blank"
      rel="noopener"
    >
      Vexip UI API 文档
    </a>
    <%_ if (useMock) { _%>
    <ul style="margin-top: 15px">
      <li v-for="person in persons" :key="person.id">
        {{ `${person.name} - ${person.sex} - ${person.age}` }}
      </li>
    </ul>
    <%_ } _%>
  </div>
</template>

<script>
<%_ if (useMock) { _%>
import { queryExample } from '../service/example'

export default {
  name: 'example',
  props: {
  },
  data () {
    return {
      persons: []
    }
  },
  async created() {
    this.persons = await queryExample()
  },
  methods: {
  }
}
<%_ } else { _%>
export default {
  name: 'example',
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
<%_ } _%>
</script>
