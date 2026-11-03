"""BEYOND THE CLASS / MAGE_01 procedural silhouette blockout.

Run in Blender 4.x:
    blender --background --python tools/blender/build_mage_blockout.py

Generates a *rough proportional blockout*, not a final sculpt or rig:
    assets/blender/hero_mage_blockout.blend
    assets/models/mage_blockout.glb
    assets/previews/mage_front.png, mage_three_quarter.png, mage_back.png

Only Blender (bpy) builds the model. The GLB is a web-ready static silhouette
prototype; no final skeletal actions, texture baking or optimization is claimed.
"""

from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
BLEND_DIR = ROOT / "assets" / "blender"
MODEL_DIR = ROOT / "assets" / "models"
PREVIEW_DIR = ROOT / "assets" / "previews"
for d in (BLEND_DIR, MODEL_DIR, PREVIEW_DIR):
    d.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for material in list(bpy.data.materials):
    bpy.data.materials.remove(material)


def mat(name, rgb, roughness=0.75, metal=0.0, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metal
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
        bsdf.inputs["Emission Strength"].default_value = strength
    return m

# Working colors for evaluating outline and reflected firelight.
ROBE = mat("ROBE | navy fabric", (0.045, 0.075, 0.13))
CLOAK = mat("CLOAK | deep-blue mantle", (0.07, 0.115, 0.18))
INNER = mat("INNER | charcoal", (0.025, 0.035, 0.045))
LEATHER = mat("LEATHER | desaturated graphite", (0.12, 0.15, 0.16))
GOLD = mat("METAL | antique gold", (0.38, 0.29, 0.17), .38, .62)
SILVER = mat("HAIR | silver", (0.65, 0.70, 0.73), .66)
SKIN = mat("SKIN | study only", (0.66, 0.48, 0.38), .82)
CRYSTAL = mat("CRYSTAL | subdued arcane blue", (0.09, 0.34, 0.67), .16, .15,
              emission=(0.05, .40, .90), strength=.35)

HEROES = []

def tag(obj, material, name=None):
    if name:
        obj.name = name
    if material:
        obj.data.materials.append(material)
    HEROES.append(obj)
    return obj


def ellipsoid(name, location, scale, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, location=location)
    o = bpy.context.object
    o.scale = scale
    return tag(o, material, name)


def cylinder(name, a, b, radius, material, vertices=12):
    a, b = Vector(a), Vector(b)
    mid = (a + b) / 2
    length = (b - a).length
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=length, location=mid)
    o = bpy.context.object
    o.rotation_euler = (b - a).to_track_quat("Z", "Y").to_euler()
    return tag(o, material, name)


def cone(name, location, radius1, radius2, depth, material, vertices=16):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius1,
                                    radius2=radius2, depth=depth, location=location)
    return tag(bpy.context.object, material, name)


def surface(name, vertices, faces, material, solidify=.0):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(o)
    tag(o, material)
    if solidify:
        modifier = o.modifiers.new("Cloth panel thickness", "SOLIDIFY")
        modifier.thickness = solidify
    return o


def curve_tube(name, points, bevel, material, cyclic=False):
    data = bpy.data.curves.new(name, "CURVE")
    data.dimensions = "3D"
    data.resolution_u = 12
    data.bevel_depth = bevel
    data.bevel_resolution = 2
    spline = data.splines.new("POLY")
    spline.points.add(len(points)-1)
    for i, p in enumerate(points):
        spline.points[i].co = (*p, 1)
    spline.use_cyclic_u = cyclic
    o = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(o)
    return tag(o, material)

# 1.8m body: simplified proportions for silhouette verification only.
# Front faces -Y. Feet meet Z=0. The face will be much more detailed later.
ellipsoid("Head silhouette", (0, -.01, 1.645), (.108, .095, .145), SKIN)
ellipsoid("Silver hair upper mass", (0, .025, 1.755), (.119, .108, .074), SILVER)
for x, y, z in [(-.104,-.055,1.714),(-.09,-.09,1.66),(.10,-.042,1.715),(.102,.01,1.67)]:
    ellipsoid("Silver hair side tuft", (x,y,z), (.035,.055,.06), SILVER)
# Hood lies behind the hair/face and still reads as a fantasy mage.
ellipsoid("Hood back volume", (0, .072, 1.67), (.16, .132, .18), INNER)

cone("Chest - tailored robe", (0, .025, 1.295), .225, .165, .53, ROBE)
ellipsoid("High neck silhouette", (0, 0, 1.535), (.12,.105,.085), INNER)
# Separate cloth panels with front slit: narrower at waist, wider toward ground.
waist_z, hem_z = 1.02, .23
for side, name in [(-1,"Left"),(1,"Right")]:
    verts=[(0,.07,waist_z),(side*.205,.04,waist_z),
           (side*.36,.025,hem_z),(side*.05,-.13,hem_z),
           (0,.21,waist_z),(side*.205,.19,waist_z),
           (side*.39,.22,hem_z),(side*.04,.11,hem_z)]
    surface(f"{name} split robe skirt",verts,
            [(0,1,2,3),(4,7,6,5),(0,4,5,1),(3,2,6,7)],ROBE,.008)

# Footwear and legs should be visible through the lower slit.
for side in [-1, 1]:
    x = side*.115
    cylinder("Leg trouser",(x,.035,.28),(x,.025,.89),.075,INNER)
    ellipsoid("Boot",(x,-.075,.113),(.105,.18,.115),LEATHER)
    cylinder("Upper arm",(side*.24,.015,1.45),(side*.355,-.02,1.18),.082,ROBE)
    ellipsoid("Shoulder cuff",(side*.25,0,1.465),(.105,.11,.095),GOLD)

# Right arm is open for casting; left hand grips the staff.
cylinder("Casting forearm",(.355,-.02,1.18),(.45,-.14,1.12),.075,INNER)
ellipsoid("Casting glove",(.46,-.16,1.12),(.067,.06,.065),LEATHER)
cylinder("Staff arm forearm",(-.355,-.02,1.18),(-.62,-.06,1.12),.068,INNER)
ellipsoid("Staff glove",(-.64,-.06,1.13),(.064,.064,.07),LEATHER)

cylinder("Waist leather belt",(-.205,-.15,1.075),(.205,-.15,1.075),.035,LEATHER)
ellipsoid("Belt buckle",(0,-.20,1.075),(.047,.025,.047),GOLD)

# One-sided asymmetric drape: the key non-staff silhouette element.
# Wider at lower right, leaving the left arm and staff distinct.
surface("Asymmetric mantle | primary silhouette",
    [( .09,.035,1.54),(.30,.115,1.48),(.52,.22,.90),(.49,.19,.38),
     (.22,.22,.51),(.13,.19,.95)],[(0,1,2,3,4,5)],CLOAK,.016)
# A thin visible gold edge is enough; it should not look like tech piping.
curve_tube("Mantle antique trim",
    [( .30,.11,1.47),(.52,.22,.90),(.49,.19,.38)],.009,GOLD)

# Staff: slender long pole, incomplete gold ring, floating diamond core.
x, y = -.69, -.065
cylinder("Staff primary pole",(x,y,.09),(x,y,2.00),.020,LEATHER)
cylinder("Staff antique grip",(x,y,.75),(x,y,1.26),.029,GOLD)
# Open arc is deliberately asymmetrical at top.
angle_start, angle_end = math.radians(-30), math.radians(235)
ring = [(x+.12*math.cos(angle_start+(angle_end-angle_start)*i/20),
         y,2.105+.12*math.sin(angle_start+(angle_end-angle_start)*i/20))
        for i in range(21)]
curve_tube("Staff open-arc crown",ring,.016,GOLD)
# Diamond core: elongated pair of cones and a small inner blue highlight.
cone("Crystal upper facet",(x,y,2.112),0.059,0,0.135,CRYSTAL,4)
cone("Crystal lower facet",(x,y,2.015),0,0.055,0.08,CRYSTAL,4)
cone("Staff crystal antique socket",(x,y,1.982),.043,.031,.056,GOLD,8)

# Non-exported locator objects demonstrate the target dimensions.
def camera(name, pos, target, ortho_scale=2.65):
    data = bpy.data.cameras.new(name)
    o = bpy.data.objects.new(name,data)
    bpy.context.collection.objects.link(o)
    o.location = pos
    direction = Vector(target) - o.location
    o.rotation_euler = direction.to_track_quat('-Z','Y').to_euler()
    data.type='ORTHO'
    data.ortho_scale = ortho_scale
    return o

cams = {
    'mage_front': camera('CAM | Front', (0,-6,1.22),(0,0,1.15)),
    'mage_three_quarter': camera('CAM | Three quarter', (3.3,-5.2,1.95),(0,0,1.15)),
    'mage_back': camera('CAM | Back', (0,6,1.22),(0,0,1.15)),
}

# Simple fire-influenced scene lighting is preview-only, not exported.
def point_light(name, pos, color, energy, size):
    d=bpy.data.lights.new(name,'AREA')
    d.energy=energy
    d.color=color
    d.shape='DISK'
    d.size=size
    o=bpy.data.objects.new(name,d)
    bpy.context.collection.objects.link(o)
    o.location=pos
    o.rotation_euler=(Vector((0,0,1.1))-o.location).to_track_quat('-Z','Y').to_euler()

point_light('LIGHT | fire rim',(0,2.5,2.5),(1.0,.25,.08),800,3)
point_light('LIGHT | cool fill',(-2,-3,3),(.28,.48,1.0),350,3)

scene=bpy.context.scene
scene.world.color=(.032,.023,.025)
scene.render.resolution_x=900
scene.render.resolution_y=1000
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
# Cycles CPU supports a wide range of Blender versions and headless setups.
scene.render.engine='CYCLES'
scene.cycles.samples=16

# Convert curve-based gold trim and staff arc into mesh geometry so glTF retains them.
for obj in list(HEROES):
    if obj.type == 'CURVE':
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target='MESH')
# Export only visible hero meshes and their materials: no preview cameras/lights.
bpy.ops.object.select_all(action='DESELECT')
for o in HEROES:
    o.select_set(True)
    bpy.context.view_layer.objects.active=o
bpy.ops.export_scene.gltf(filepath=str(MODEL_DIR/'mage_blockout.glb'),
                          export_format='GLB',use_selection=True)
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_DIR/'hero_mage_blockout.blend'))
for name, cam in cams.items():
    scene.camera=cam
    scene.render.filepath=str(PREVIEW_DIR/(name+'.png'))
    bpy.ops.render.render(write_still=True)

print('MAGE_01 blockout generated in:',ROOT)