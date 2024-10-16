let img_size = 600;
let cnvs_size = {};
let timeout = 0;
let img_iteration = 1;
let image_bred = false;
let image_saved = false;
let scheme = {
  BG:'#DCA0C8',
  text:'#AC3685'
}
let cnvs;
let img_A;
let img_B;
let img_C;

let testing = false;

/*

  background-color: #04AA6D; Green 
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
*/

function style_button(element){
  element.style('background-color', scheme.BG);
  element.style('border', '4px solid white');
  element.style('border-radius', '8px')
  element.style('color', scheme.text);
  element.style('padding', '10px 10px');
  element.style('text-align', 'center');
  element.style('text-decoration', 'none');
  element.style('display', 'block');
  element.style('font-family', 'Gluten')
  element.style('font-size', '30px');
  element.style('font-weight', 'bold')
}

function preload(){
  
  //indices = grab_indices();
  //img_A = new GenePhoto();
  //img_B = fetch_image();
  
  img_A = new PhotoDNA();
  img_B = new PhotoDNA();
  img_C = createImage(img_size, img_size);
  if(testing){img_D = fetch_image();}
  img_A.id = "img_A";
  img_B.id = "img_B";
  
}

function setup(){
  
  cnvs_size.x = img_size;
  cnvs_size.y = ceil(img_size*(9.7/6))
  cnvs = createCanvas(cnvs_size.x, cnvs_size.y);
  cnvs.position(windowWidth/2-width/2,windowHeight/8);
  cnvs.id('canvas')
  frameRate(30);
  
  img_reset_1 = createButton('New Image');
  img_reset_1.position(cnvs.x, cnvs.y-(0.1066*img_size));
  style_button(img_reset_1);
  img_reset_1.mousePressed(fetch_new_A);
  img_reset_1.touchEnded(fetch_new_A);
  
  img_reset_2 = createButton('New Image');
  img_reset_2.position(cnvs.x+cnvs.width-(0.3366*img_size), cnvs.y-(0.1066*img_size));
  style_button(img_reset_2);
  img_reset_2.mousePressed(fetch_new_B);
  img_reset_2.touchEnded(fetch_new_B);
  
  breed_images = createButton('Degenerate');
  breed_images.position(cnvs.x+cnvs.width/2-(0.1783*img_size), cnvs.y+(0.5083*img_size));
  style_button(breed_images);
  breed_images.mousePressed(breed);
  breed_images.touchEnded(breed);
  
  save_button = createButton('Save to device');
  save_button.position(cnvs.x, cnvs.y+cnvs.height);
  style_button(save_button);
  save_button.mousePressed(save_baby);
  save_button.touchEnded(save_baby);
  save_button.hide();
  
  load_text = createP('Gestating...');
  load_text.position(cnvs.x+(0.2333*img_size), cnvs.y+(0.6666*img_size))
  load_text.style('text-align', 'center');
  load_text.style('font-weight','bold');
  load_text.style('font-size','50px');
  load_text.style('color', scheme.text)
  load_text.hide();
  
  save_warning = createP("You've already\rsaved this!");
  save_warning.position(cnvs.x+(0.5*img_size),  cnvs.y+cnvs.height)
  save_warning.style('font-weight','bold');
  save_warning.style('font-size','20px');
  save_warning.style('color', scheme.text);
  save_warning.hide();
  
  
  img_A.set_thumb();
  img_B.set_thumb();
  
  img_A.generate_dna();
  img_B.generate_dna();
  
  
  // print(img_A.avg_r,img_A.avg_g, img_A.avg_b);
  // print(img_A.r_pix,img_A.g_pix, img_A.b_pix);
  // print(calc_hue(img_A.avg_r,img_A.avg_g, img_A.avg_b))
  // print(img_B.avg_r,img_B.avg_g, img_B.avg_b);
  // print(img_B.r_pix,img_B.g_pix, img_B.b_pix);
  // print(calc_hue(img_B.avg_r,img_B.avg_g, img_B.avg_b))
  if(testing){
    img_reset_1.hide();
    img_reset_2.hide();
    breed_images.hide();
    save_button.hide();
    
    
    let chunk_vals = [];
    chunk_vals[0] = floor(random(0,img_size*0.8));//width
    chunk_vals[1] = floor(random(0,img_size*0.8));//height
    chunk_vals[2] = floor(random(0,img_size-chunk_vals[0]));//source x
    chunk_vals[3] = floor(random(0,img_size-chunk_vals[1]));//source y
    chunk_vals[4] = floor(random(0,img_size-chunk_vals[0]));//destination x
    chunk_vals[5] = floor(random(0,img_size-chunk_vals[1]));//destination y
    
    write_chunk(img_D, img_A.img, chunk_vals);
  }
}

function draw(){
  clear();
  if(!testing){
    if(image_bred&&show_baby){
      image(img_C, 0, 370);
      save_button.show();
    }
    push();
    noFill();
    stroke(255);
    strokeWeight(8)
    rectMode(CENTER);
    rect(cnvs.width/2, 270, cnvs.width*(3/5), 130, 20);
    pop();
    image(img_A.thumb, 0, 0);
    image(img_B.thumb, 300, 0);

    if(timeout > 0){
      timeout --;
    }else if(timeout == 0){
      save_warning.hide();
      load_text.hide();
      show_baby = true;
    }
  }else{
    image(img_D, 0, 0);
  }
}

function windowResized(){
  cnvs.position(windowWidth/2-width/2,windowHeight/8);
  img_reset_1.position(cnvs.x, cnvs.y-(0.1066*img_size));
  img_reset_2.position(cnvs.x+cnvs.width-(0.3366*img_size), cnvs.y-(0.1066*img_size));
  breed_images.position(cnvs.x+cnvs.width/2-(0.1783*img_size), cnvs.y+(0.5083*img_size));
  load_text.position(cnvs.x+(0.2333*img_size), cnvs.y+(0.6666*img_size))
  save_button.position(cnvs.x, cnvs.y+cnvs.height);
  save_warning.position(cnvs.x+(0.3333*img_size),  cnvs.y+cnvs.height)
}

function fetch_new_A(){
  img_A.fetch_new();
}

function fetch_new_B(){
  img_B.fetch_new();
}

function breed(){
  if(timeout==0){
    load_text.show();
    save_button.hide();
    show_baby = false;
    timeout = 100;
    img_C.set(0, 0, splice_images(img_A, img_B));
  }
}

function save_baby(){
  if(image_saved){
    timeout = 100;
    save_warning.show();
    return;
  }else{
    save(img_C, "degeneration.png");
    image_saved = true;
  }
}

function fetch_image(){
  img_iteration += 1;
  return loadImage("https://picsum.photos/"+String(img_size)+"?random="+String(img_iteration));
}

function copy_image(imgA, imgB){
  imgA.set(0, 0, imgB);
}

function calc_hue(R, G, B){
  
  let r = R/255;
  let g = G/255;
  let b = B/255;
  
  let MIN = min(r, g, b);
  let MAX = max(r, g, b);
  
  let hue_val = 0;
  
  if(MIN === MAX){
    if(r != MAX){
      hue_val = 3;
    } else if(g != MAX){
      hue_val = 6;
    } else if(b != MAX){
      hue_val = 1;
    }
    return 0;
  }
  
  if(MAX === r){
    hue_val = ((g - b)/(MAX - MIN));
  }else if(MAX === g){
    hue_val = (2+(b - r)/(MAX - MIN));
  }else{
    hue_val = (4+(r - g)/(MAX - MIN));
  }
  
  hue_val = hue_val*60;
  if(hue_val < 0){
    hue_val += 360;
  }
  return hue_val;
}

// takes two objects of type PhotoDNA, and creates a new image based on their values
function splice_images (IMG1, IMG2){
  let new_image = createImage(IMG1.img.width, IMG1.img.height); 
  
  let parents = [IMG1, IMG2]
  let key_vals = [];
  let shift_chan = [];
  let shuf_chan = []; //Holds boolean values for selecting colour channels
  let chunk_vals = []; //Holds integer values for selection a portion of an image
  let dom; //index for dominant parent
  let rec; //index for recessive parent
  let genes = []; // Array for adding integers that trigger certain functions that alter the new image
  {
    if(random(-IMG2.lumin,IMG1.lumin)>0){dom = 0;rec = 1;}
    else {dom = 1;rec = 0;}

    if(random(-parents[dom].avg_r,parents[rec].avg_r)>0){
      // whether or not to replace red channel
      genes.push(0);
    }else if(random(-parents[dom].avg_g,parents[rec].avg_g)>0){
      // whether or not to replace green channel
      genes.push(1);
    }else if(random(-parents[dom].avg_b,parents[rec].avg_b)>0){
      // whether or not to replace blue channel
      genes.push(2);
    }
    
    if(random(-1,1)>0){
      // whethor or not to shuffle image chunks
      genes.push(3);
    }
    if(random(-parents[dom].avg_r, parents[rec].avg_b)>0){
      // whether or not to shuffle channel chunks
      genes.push(4);
      shuf_chan[0] = random(-parents[dom].r_pix, parents[rec].r_pix)>0;
      shuf_chan[1] = random(-parents[dom].g_pix, parents[rec].g_pix)>0;
      shuf_chan[2] = random(-parents[dom].b_pix, parents[rec].b_pix)>0;
    }
    if(random(-1,1)>0){
      // whether or not to shift image
      genes.push(5);
    }

    if(random(-parents[dom].amg_g, parents[rec].avg_r)>0){
      // whether or not to shift channels
      genes.push(6);
      if(random(-parents[dom].c_pix, parents[rec].c_pix)>0){
      shift_chan = 0;
         
      }else if(random(-parents[dom].m_pix, parents[rec].m_pix)>0){
      shift_chan = 1;
               
      }else{
      shift_chan = 2;
        
      }
    }

    if(random(-parents[dom].l_key,parents[rec].l_key)>0){
      // whether or not to grab random chunk from recessive parent
      genes.push(7);
      {
        chunk_vals = [];
        chunk_vals[0] = floor(random(0,img_size));
        chunk_vals[1] = floor(random(0,img_size));
        chunk_vals[2] = floor(random(0,img_size-chunk_vals[0]));
        chunk_vals[3] = floor(random(0,img_size-chunk_vals[1]));
        chunk_vals[4] = floor(random(0,img_size-chunk_vals[0]));
        chunk_vals[5] = floor(random(0,img_size-chunk_vals[1]));
      }
    }

    if(random(-parents[dom].m_key,(parents[rec].l_key+parents[rec].h_key))>0){
      // whether or not to replace pixels of a certain brightness value
      genes.push(8);
      key_vals = [random(0, 255), random(0, 20)]
    }
    if(random(-parents[rec].avg_r,parents[dom].avg_r)>0){
      genes.push(9);
    }else if(random(-parents[rec].avg_g,parents[dom].avg_g)>0){
      genes.push(10);
    }else if(random(-parents[rec].avg_g,parents[dom].avg_g)>0){
      genes.push(11);
    }
    
    if(random(-parents[dom].c_pix, parents[rec].c_pix)>0){
      genes.push(12);
    }else if(random(-parents[dom].m_pix, parents[rec].m_pix)>0){
      genes.push(13);
    }else if(random(-parents[dom].y_pix, parents[rec].y_pix)>0){
      genes.push(14);
    }
  }
  
  
  /*
  dom = 0;
  rec = 1;
  genes = [9]
  shuf_chan = [true, true, true];
  key_vals = [random(0, 255), random(0, 25)]
  {
        chunk_vals = [];
        chunk_vals[0] = floor(random(0,img_size));
        chunk_vals[1] = floor(random(0,img_size));
        chunk_vals[2] = floor(random(0,img_size-chunk_vals[0]));
        chunk_vals[3] = floor(random(0,img_size-chunk_vals[1]));
        chunk_vals[4] = floor(random(0,img_size-chunk_vals[0]));
        chunk_vals[5] = floor(random(0,img_size-chunk_vals[1]));
      }
  */
  new_image.set(0, 0, parents[dom].img);
  shuffle(genes, true);
  
  while(genes.length>0){
    switch(genes[genes.length-1])
    {
      case 0:
        replace_channel(new_image, parents[rec].img, 0);
        // print('0');
        break;
      case 1:
        replace_channel(new_image, parents[rec].img, 1);
        // print('1');
        break;
      case 2:
        replace_channel(new_image, parents[rec].img, 2);
        // print('2');
        break;
      case 3:
        shuffle_chunks(new_image);
        // print('3');
        break;
      case 4:
        shuffle_channels(new_image, shuf_chan);
        // print('4');
        break;
      case 5:
        seam_shift(new_image,floor(random(new_image.width/5, new_image.width)), (parents[rec].sat_pix>parents[rec].total_pix/4))
        // print('5');
        break;
      case 6:
        shift_channel(new_image, floor(random(50, new_image.width)), shift_chan, (parents[dom].sat_pix>parents[rec].total_pix/4))
        // print('6');
        break;
      case 7:
        write_chunk(new_image, parents[rec].img, chunk_vals);
        // print('7');
        break;
      case 8:
        replace_pixels_key(new_image, parents[rec].img, key_vals);
        // print('8');
        break;
      case 9:
        replace_pixels_hue(new_image, parents[rec].img, [0, 30]);
        // print('9');
        break;
      case 10:
        replace_pixels_hue(new_image, parents[rec].img, [120, 30]);
        // print('10');
        break;
      case 11:
        replace_pixels_hue(new_image, parents[rec].img, [240, 30])
        // print('11');
        break;
      case 12:
        remove_pixels_hue(new_image, parents[rec].img, [60, 15])
        // print('12');
        break;
      case 13:
        remove_pixels_hue(new_image, parents[rec].img, [180, 15])
        // print('13');
        break;
      case 14:
        remove_pixels_hue(new_image, parents[rec].img, [300, 15])
        // print('14');
        break;
     }
    genes.pop();
  }
  
  
  
  
  image_bred = true;
  image_saved = false;
  return new_image;
}

class PhotoDNA {
  constructor(){
    this.img = fetch_image();
    this.backup = fetch_image();
    this.generate_dna();
  }
  
  generate_dna(){
    this.img.loadPixels();
    
    let avg_r = 0;
    let avg_g = 0;
    let avg_b = 0;
    let r_pix = 0;
    let y_pix = 0;
    let g_pix = 0;
    let c_pix = 0;
    let b_pix = 0;
    let m_pix = 0;
    let h_key = 0;
    let m_key = 0;
    let l_key = 0;
    let lumin = 0;
    
    let temp_hue;
    let temp_key;
    let hue_tol = 30;
    let col_shift = 60;
    
    let hues = [0, 60, 120, 180, 240, 300]

    for(let i = 0; i < this.img.pixels.length; i += 4){
      avg_r += this.img.pixels[i];
      avg_g += this.img.pixels[i + 1];
      avg_b += this.img.pixels[i + 2];
      temp_hue = (calc_hue(this.img.pixels[i], this.img.pixels[i+1], this.img.pixels[i+2])+col_shift)%360;
      temp_key = get_key(this.img.pixels[i],
                             this.img.pixels[i+1],
                             this.img.pixels[i+2]);
      
      let is_bright = ((15<temp_key)&&(temp_key<242));
      
      if(!is_bright){
        
      }else if(abs(temp_hue-(hues[0]+col_shift))<hue_tol)
      //Count pixels that appear red
      {r_pix += 1;}
      
      else if(abs(temp_hue-(hues[1]+col_shift))<hue_tol)
      //Count pixels that appear yellow
      {y_pix += 1;}
      
      else if(abs(temp_hue-(hues[2]+col_shift))<hue_tol)
      //Count pixels that appear green
      {g_pix += 1;}
      
      else if(abs(temp_hue-(hues[3]+col_shift))<hue_tol)
      //Count pixels that appear cyan
      {c_pix += 1;}
      
      else if(abs(temp_hue-(hues[4]+col_shift))<hue_tol)
      //Count pixels that appear blue
      {b_pix += 1;}
      
      else if(abs(temp_hue-(hues[5]+col_shift))<hue_tol)
      //Count pixels that appear magenta
      {m_pix += 1;}
      
      
      //calculate average luminance of each pixel
      //luminance formula: (0.2126*R + 0.7152*G + 0.0722*B)
      
      //print(temp_key);
      if(temp_key >= 160){
        h_key += 1;
      }else if(temp_key <= 96){
        l_key += 1;
      }else{
        m_key += 1;
      }
      lumin += temp_key;
    }

    lumin = lumin/(this.img.pixels.length/4);
    
    //Average Red value
    this.avg_r = round(avg_r/(this.img.pixels.length/4));
    //Average Green value 
    this.avg_g = round(avg_g/(this.img.pixels.length/4));
    //Average Blue value 
    this.avg_b = round(avg_b/(this.img.pixels.length/4)); 
    
    this.r_pix = r_pix; //Number of pixels that appear red
    this.y_pix = y_pix;
    this.g_pix = g_pix;
    this.c_pix = c_pix;
    this.b_pix = b_pix;
    this.m_pix = m_pix;
    this.h_key = h_key;
    this.m_key = m_key;
    this.l_key = l_key;
    this.lumin = lumin;
    this.total_pix = this.img.pixels.length/4;
    this.sat_pix = this.r_pix + this.y_pix + this.g_pix + this.c_pix + this.b_pix + this.m_pix

    // print(r_pix, g_pix, b_pix);
    // print(y_pix, c_pix, m_pix);
    // print(h_key, m_key, l_key);
    // print((h_key/m_key)*(l_key/m_key));
  }
  
  fetch_new(){
    this.img.set(0, 0, this.backup);
    this.backup = fetch_image();
    this.set_thumb();
    this.generate_dna();
  }
  
  set_thumb(){
    this.thumb = createImage(img_size, img_size);
    this.thumb.loadPixels();
    this.img.loadPixels();
    for(let i = 0; i < this.img.pixels.length; i += 1){
      this.thumb.pixels[i] = this.img.pixels[i];
    }
    this.thumb.updatePixels();
    this.thumb.resize(300,300);
  }
}

function calc_CQ(high_con, low_con, total){
  let mid_con = total - (high_con + low_con);
  print((high_con/mid_con)*(low_con/mid_con));
}
