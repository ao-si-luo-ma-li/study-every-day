### Camera 的不同点
* three.js 中 PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )：
  fov — 摄像机视锥体垂直视野角度;
  在大多数属性发生改变之后，你将需要调用.updateProjectionMatrix来使得这些改变生效
* cesium.js 中 PerspectiveFrustum：
  fov - This angle will be used as the horizontal FOV if the width is greater than the height, otherwise it will be the vertical FOV.
  fovy - Gets the angle of the vertical field of view

### threeJs 材质
* MeshBasicMaterial：对光照无感，给几何体一种简单的颜色或显示线框
* MeshLambertMaterial：这种材质对光照有反应，用于创建暗淡的不发光的物体
* MeshPhongMaterial：这种材质对光照也有反应，用于创建金属类明亮的物体
* MeshNormalMaterial：法线网格材质，一种把法向量映射到RGB颜色的材质