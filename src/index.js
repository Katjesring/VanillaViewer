import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SplatLoader, Splat } from './Splat'
import './styles.css'

const cakewalk = 'https://huggingface.co/cakewalk/splat-data/resolve/main'
const dylanebert = 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/kitchen'

const scene = new THREE.Scene()
scene.background = new THREE.Color('white')
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(4, 1.5, -4)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
document.getElementById('root').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

window.addEventListener('resize', resize)
resize()

async function app() {
  const loader = new SplatLoader(renderer)
  const [shoeSplat, plushSplat, kittchenSplat] = await Promise.all([
    loader.loadAsync(`${cakewalk}/nike.splat`),
    loader.loadAsync(`${cakewalk}/plush.splat`),
    loader.loadAsync(`${dylanebert}/kitchen-7k.splat`)
  ])

  const shoe1 = new Splat(shoeSplat, camera, { alphaTest: 0.1 })
  shoe1.scale.setScalar(0.5)
  shoe1.position.set(0, 1.6, 2)
  scene.add(shoe1)

  // This will re-use the same data, only one load, one parse, one worker, one buffer
  const shoe2 = new Splat(shoeSplat, camera, { alphaTest: 0.1 })
  shoe2.scale.setScalar(0.5)
  shoe2.position.set(0, 1.6, -1.5)
  shoe2.rotation.set(Math.PI, 0, Math.PI)
  scene.add(shoe2)

  const plush = new Splat(plushSplat, camera, { alphaTest: 0.1 })
  plush.scale.setScalar(0.5)
  plush.position.set(-1.5, 1.6, 1)
  scene.add(plush)

  const kittchen = new Splat(kittchenSplat, camera)
  kittchen.position.set(0, 0.25, 0)
  scene.add(kittchen)
}

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()
app()
