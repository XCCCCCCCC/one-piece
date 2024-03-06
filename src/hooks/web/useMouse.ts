import { ref, onMounted, onUnmounted } from 'vue'
export default function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const handleMousemove = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    window.addEventListener('mousemove', handleMousemove)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMousemove)
  })
  return { x, y }
}
