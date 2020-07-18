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
      <li v-for="example in examples" :key="example.id">
        {{ `${example.name} - ${example.sex} - ${example.age}` }}
      </li>
    </ul>
    <%_ } _%>
  </div>
</template>

<script>
<%_ if (useMock) { _%>
import { queryExamples } from '../service/example'

export default {
  name: 'example',
  props: {
  },
  data () {
    return {
      examples: []
    }
  },
  async created() {
    this.examples = await queryExamples()
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
