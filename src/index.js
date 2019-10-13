import * as THREE from 'three'
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { getRandomStarField, autoResize, renderLoop } from './utils'

import canModelName from './can.glb'
import './index.css'
import labelsRaw from './labels/*.jpg'

const labels = Object.values(labelsRaw)

const container = document.createElement('div')
document.body.appendChild(container)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100)
camera.position.x = 0.15
camera.position.y = 1.5
camera.position.z = 2
camera.focalLength = 3

const pointLight = new THREE.PointLight(0xffffff, 5)
pointLight.position.set(10, 10, 0)
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 5)
pointLight2.position.set(-20, -20, 0)
scene.add(pointLight2)

var skyBox = new THREE.BoxGeometry(120, 120, 120)
var textureCube = new THREE.MeshBasicMaterial({
  map: getRandomStarField(600, 2048, 2048),
  side: THREE.BackSide
})
var sky = new THREE.Mesh(skyBox, textureCube)
scene.add(sky)
scene.background = textureCube

let Label
const loader = new GLTFLoader()
loader.load(canModelName, gltf => {
  scene.add(gltf.scene)
  Label = scene.getObjectByName('Label')
}, undefined, error => console.error(error))

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)
const effect = new AnaglyphEffect(renderer)
effect.setSize(window.innerWidth || 2, window.innerHeight || 2)

autoResize(camera, effect)

let mouseX = camera.position.x
let mouseY = camera.position.y
document.addEventListener('mousemove', event => {
  mouseX = (event.clientX - (window.innerWidth / 2)) / 100
  mouseY = (event.clientY - (window.innerHeight / 2)) / 100
}, false)

let i = 0
document.addEventListener('mousedown', event => {
  i++
  Label.material.map.image = new Image()
  Label.material.map.image.src = labels[i % labels.length]
  Label.material.map.needsUpdate = true
})

renderLoop(() => {
  camera.position.x = mouseX
  camera.position.y = mouseY
  camera.lookAt(new THREE.Vector3(scene.position.x, scene.position.y + 1, scene.position.z))
  effect.render(scene, camera)
})
