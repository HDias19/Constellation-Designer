import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let scene, camera, renderer, controls, decoded, gui, points, line, materialLine;
const width = window.innerWidth;
const height = window.innerHeight;

let starWidth = 2;
let lineSize = 30;

let stars = []

let center = [0,0]

let type = ["adjective", "adverb", "article", "conjunction",
            "interjection", "noun", "preposition", "pronoun", "verb"]


// It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife
// let words = [["It","Pronoun"], ["is","Verb"], ["a", "Article"], ["truth", "Noun"], ["universally", "Adverb"], ["acknowledged", "Verb"], ["that", "Conjunction"], ["a", "Article"], ["single","Adjective"], ["man","Noun"], ["in", "Preposition"], ["possession", "Noun"], ["of", "Preposition"], ["a", "Article"], ["good", "Adjective"], ["fortune", "Noun"], ["must", "Verb"], ["be", "Verb"], ["in", "Preposition"], ["want", "Noun"], ["of", "Preposition"], ["a", "Article"], ["wife", "Noun"]]
// Over the shadowy hills and windy peaks Artemis draws her golden bow
// let words = [["Over","Preposition"], ["the","Article"], ["shadowy", "Adjective"], ["hills", "Noun"], ["and", "Conjunction"], ["windy", "Adjective"], ["peaks", "Noun"], ["Artemis", "Noun"], ["draws", "Verb"], ["her", "Pronoun"], ["golden", "Adjective"], ["bow", "Noun"]]
// let words = [["Loving","Verb"], ["this","Adverb"], ["journey", "Noun"], ["lmao", "Interjection"]]
// Artemis of the wilderness, lady of wild beasts
// let words = [["Artemis", "Noun"], ["of", "Preposition"], ["the", "Article"], ["wilderness", "Noun"], [",", "Conjunction"], ["lady", "Noun"], ["of", "Preposition"], ["wild", "Adjective"], ["beasts", "Noun"]]
// let words = [["And", "Conjunction"], ["the", "Article"], ["hunters", "Noun"], ["as", "Adverb"], ["they", "Pronoun"], ["advance", "Verb"], ["will", "Verb"], ["hymn", "Verb"], ["Artemis", "Noun"], ["Agrotera", "Adjective"]]
// let words = [["Driving", "Verb"], ["off", "Adverb"], ["with", "Preposition"], ["her", "Pronoun"], ["fast-trotting", "Adjective"], ["deer", "Noun"], ["over", "Preposition"], ["the", "Article"], ["hills", "Noun"], ["fawning", "Adjective"], ["beasts", "Noun"], ["whimper", "Verb"], ["in", "Preposition"], ["homage", "Noun"], ["and", "Conjunction"], ["tremble", "Verb"], ["as", "Adverb"], ["Artemis", "Noun"], ["passes", "Verb"], ["by", "Adverb"]]
let words = [["Held", "verb"], ["together", "adverb"], ["by", "preposition"], ["hopes", "noun"], ["and", "conjunction"], ["dreams", "noun"]]
// let words = [["The", "Article"], ["compelling", "Adjective"], ["thing", "Noun"], ["about", "Preposition"], ["making", "Verb"], ["art", "Noun"], ["or", "Conjunction"], ["making", "Verb"], ["anything", "Noun"], ["I", "Pronoun"], ["suppose", "Verb"], ["is", "Verb"], ["the", "Article"], ["moment", "Noun"], ["when", "Adverb"], ["the", "Article"], ["vaporous", "Adjective"], ["insubstantial", "Adjective"], ["idea", "Noun"], ["becomes", "Verb"], ["a", "Article"], ["solid", "Adjective"], ["there", "Adverb"], ["a", "Article"], ["thing", "Noun"], ["a", "Article"], ["substance", "Noun"], ["in", "Preposition"], ["a", "Article"], ["world", "Noun"], ["of", "Preposition"], ["substances", "Noun"]]
// let words = [["Oh", "Interjection"], ["Diana", "Noun"], ["queen", "Noun"], ["of", "Preposition"], ["the", "Article"], ["groves", "Noun"], ["thou", "Pronoun"], ["who", "Pronoun"], ["in", "Preposition"], ["solitude", "Noun"], ["lovest", "Verb"], ["thy", "Pronoun"], ["mountain-haunts", "Noun"], ["and", "Conjunction"], ["who", "Pronoun"], ["upon", "Preposition"], ["the", "Article"], ["solitary", "Adjective"], ["mountains", "Noun"], ["art", "Verb"], ["alone", "Adjective"], ["held", "Verb"], ["holy", "Adjective"]]
// let words = [["Look", "Interjection"], ["I", "Pronoun"], ["'m", "Verb"], ["not", "Adverb"], ["like", "Preposition"], ["all", "Article"], ["the", "Article"], ["others", "Noun"], ["on", "Preposition"], ["Olympus", "Noun"], ["The", "Article"], ["power", "Noun"], ["of", "Preposition"], ["the", "Article"], ["hunt", "Noun"], ["helps", "Verb"], ["keep", "Verb"], ["me", "Pronoun"], ["company", "Noun"], ["so", "Adverb"], ["maybe", "Adverb"], ["it", "Pronoun"], ["'ll", "Verb"], ["help", "Verb"], ["you", "Pronoun"], ["too", "Adverb"]]

function init() {
    //scene
    scene = new THREE.Scene();

    //camera orthographic
    camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 1, 1000);
    camera.lookAt(scene.position);
    scene.add(camera);

    //renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x89cff0);
    renderer.setClearColor(0xd3d3d3);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    //directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls( camera, renderer.domElement );

    // GUI
    gui = new GUI()
    const base = {
        Reset: function() {
            starWidth = 2;
            lineSize = 30;
        },
        Draw: function() {
            deleteConstelation();
            createConstelation(); 
            centerScreen();       
        },
        Words: function() {
            let aux = prompt("Please enter the words you want to use and its word type, separated by colons and commas", 
                                "Held:Verb,together:Adverb,by:Preposition,hopes:Noun,and:Conjunction,dreams:Noun")
                                .trim().replace(/\s/g, "").toLowerCase().replace(/ /g, "")
                                .split(",")
            console.log(aux)
            words = []
            aux.forEach(element => {
                let aux2 = element.split(":")
                words.push([aux2[0], aux2[1]])
            });
            console.log(words)
            deleteConstelation();
            createConstelation(); 
            centerScreen();       
        }
    }
    
    const LineFolder = gui.addFolder('Line'),
    line = {
        get 'Line Size' () {
            return lineSize
        },
        set 'Line Size' (value) {
            lineSize = value
        }
    }

    const StarFolder = gui.addFolder('Star'),
    star = {
        get 'Star Size' () {
            return starWidth
        },
        set 'Star Size' (value) {
            starWidth = value
        }
    }

    LineFolder.add(line, 'Line Size', 10, 50).listen()
    LineFolder.open()
    StarFolder.add(star, 'Star Size', .05, 10, 0.05).listen() 
    StarFolder.open()
    gui.add(base, 'Words').listen();
    gui.add(base, 'Draw').listen();
    gui.add(base, 'Reset').listen();

    createConstelation();

    centerScreen();

    window.addEventListener( 'resize', onWindowResize );

    animate();
}

function centerScreen() {
    let max = [0,0], min = [0,0]
    stars.forEach(element => {
        if (element.position.x > max[0]) max[0] = element.position.x
        if (element.position.y > max[1]) max[1] = element.position.y
        if (element.position.x < min[0]) min[0] = element.position.x
        if (element.position.y < min[1]) min[1] = element.position.y
    });
    camera.position.set((max[0]+min[0])/2, (max[1]+min[1])/2, 100);

    controls.target.set((max[0]+min[0])/2, (max[1]+min[1])/2, 100);
    controls.update();
}

function decoder(words) {
    let toret = []
    try {
        words.forEach(word => {
            toret.push([word[0].length, type.indexOf(word[1])])
        });
    } catch (error) {
        alert("Creation failed, please check the words and try again.")
    }
    return toret
}

function createConstelation() {
    center = [0,0]
    
    decoded = decoder(words)

    let colors = []
    let gradient = new THREE.Color().setHSL(0, 1, 0.5);
    let gradientStep = 1 / decoded.length;

    for (let i = 0; i < decoded.length; i++) {
        let color = new THREE.Color().copy(gradient);
        colors.push(color);
        gradient.offsetHSL(gradientStep, 0, 0);
    }
    colors.reverse();
    
    let geometry, material, circle;
    
    for (let i = 0; i < decoded.length; i++) {
        let element2, element = decoded[i];
        if (i == 0) {
            element2 = decoded[0]
        } else {
            element2 = decoded[i-1]
        }
        geometry = new THREE.CircleGeometry(starWidth*element[0], 50);
        material = new THREE.MeshBasicMaterial({color: colors.pop()});
        circle = new THREE.Mesh(geometry, material);
        let vector = new THREE.Vector3(0, 1);

        vector.applyAxisAngle(new THREE.Vector3(0,0,-1), 2*Math.PI*(element[1]/9));
        circle.position.set(center[0], center[1], 0);
        circle.translateOnAxis(vector, lineSize*element2[0]);
        stars.push(circle)
        center = [circle.position.x, circle.position.y]
        scene.add(circle);
    }

    //line
    materialLine = new THREE.LineBasicMaterial( { color: 0x000000 } );
    points = [];
    stars.forEach(element => {
        points.push( element.position );
    });
    line = new THREE.Line( new THREE.BufferGeometry().setFromPoints( points ), materialLine );
    scene.add( line );
}

function deleteConstelation() {
    stars.forEach(element => {
        scene.remove(element);
    });
    points = []
    scene.remove(line);
    stars = []
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;