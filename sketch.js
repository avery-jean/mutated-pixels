let img_size = 600;
let img_iteration = 1;

function preload(){
  createCanvas(600, 600);
  background(255, 182, 182);
  
  //indices = grab_indices();
  //img_A = new GenePhoto();
  //img_B = fetch_image();
  
  img_A = fetch_image();
  img_B = createImage(img_size, img_size);
  
}

function setup() {
  createCanvas(600, 600);
  img_B.set(0, 0, img_A);
  
  rotate_image(img_A);
  
  //img_A.resize(300, 300);
  img_B.resize(300, 300);
}

function draw() {
  //show_image(img_A_R, img_A_G, img_A_B)
  image(img_A, 0, 0);
  //image(img_B, 300, 0);
  
  
}

function show_image(A, B, C){
  push();
  clear();
  blendMode(ADD);
  image(A, 0, 0);
  image(B, 0, 0);
  image(C, 0, 0);
  pop();
  
}

function scale_to_canvas(){
  
}

function choose_new(img){
  img = fetch_image();
}

function rip_channel(img1, channel){
  if(0 > channel > 3){
    return;
  }
  
  img1.loadPixels();
  let img2 = createImage(img_size, img_size);
  img2.loadPixels();
  
  for(let i = 0; i < img1.pixels.length; i += 4){
    img2.pixels[i+channel] = img1.pixels[i+channel];
    img2.pixels[i+3] = img1.pixels[i+3];
  }
  
  img2.updatePixels();
  return img2;
}

function compile_channels(channels){
  let new_img = createImage(img_size, img_size);
  new_img.loadPixels();
  channels[0].loadPixels();
  channels[1].loadPixels();
  channels[2].loadPixels();
  
  for(let i = 0; i < new_img.pixels.length; i += 4){
    new_img.pixels[i] = channels[0].pixels[i];
    new_img.pixels[i+1] = channels[1].pixels[i+1];
    new_img.pixels[i+2] = channels[2].pixels[i+2];
    new_img.pixels[i+3] = channels[0].pixels[i+3];
  }
  new_img.updatePixels();
  return new_img;
}

function style_text(){
  textFont("")
}

function fetch_image(){
  img_iteration += 1;
  return loadImage("https://picsum.photos/"+String(img_size)+"?random="+String(img_iteration));
}

function replace_HKpixels(img1, img2){
  img1.loadPixels();
  img2.loadPixels();
  let temp_img = createImage(img1.width, img1.height);
  temp_img.set(0, 0, img2);
  temp_img.loadPixels();
  for(let i = 0; i < img1.pixels.length; i += 4){
    let temp_key = (0.2126 * img2.pixels[i] +
                    0.7152 * img2.pixels[i+1] +
                    0.0722 * img2.pixels[i+2]);
    if(temp_key > 160){
      for(let k = 0; k < 4; k += 1){
        temp_img.pixels[i+k] = img1.pixels[i+k];
      }
    }
  }
  temp_img.updatePixels();
  return temp_img;
}

function write_chunk(img1, img2, x1, y1, x2, y2, w, h){
  let chunk = grab_chunk(img1, x1, y1, w, h);
  
  let i,j,k,z = 0;
  for(i = y2; i < y2+h; i += 1){
    for(j = x2; j < x2+w; j += 1){
      let arr_pos = (i*img2.width + j)*4;
      for(k = 0; k < 4; k += 1){
        img2.pixels[arr_pos+k] = chunk[z];
        z += 1;
      }
    }
  }
  img2.updatePixels();
}

function grab_chunk(img, x, y, w, h){
  let i,j,k = 0;
  let img_chunk = [];
  for(i = y; i < y+h; i += 1){
    for(j = x; j < x+w; j += 1){
      let arr_pos = (i*img.width + j)*4;
      for(k = 0; k < 4; k += 1){
        img_chunk.push(img.pixels[arr_pos+k]);
      }
    }
  }
  return img_chunk;
}

// takes two objects of type PhotoDNA, and creates a new image based on their values
function splice_images (IMG1, IMG2){
  let new_image = createImage(img1.width, img1.height); 
  new_image.loadPixels();
  
  let mutations = {}; // Object to be filled somwhat random integer and boolean values to determine new images mutations
  mutations.parent_one = random(-IMG2.lumin,IMG1.lumin)>0;
  mutations.shuffle = random(-1,1)>0;
  mutations.shuf_channels = random(-IMG1.avg_r, IMG2.avg_b)>0;
  mutations.shift = random(-1,1)>1;
  mutations.shift_channels = random(-IMG1.amg_g, IMG2.avg_r)>0;
  mutations.red_shift = random(-IMG1.r_pix, IMG2.r_pix)>0;
  mutations.green_shift = random(-IMG1.g_pix, IMG2.g_pix)>0;
  mutations.blue_shift = random(-IMG1.b_pix, IMG2.b_pix)>0;
  mutations.shuffle_size = 0;
  mutations.random_chunk = random(-IMG1.l_key,IMG2.l_key)>0;
  
  if(mutations.parent_one){
    copy_image(new_image, IMG1);
  }else{
    copy_image(new_image, IMG2);
  }
  
  if(mutations.shuffle && mutations.shift){
    
  }else if(mutations.shuffle){
    
  }else{
    
  }
  
  
  new_image.updatePixels();
  return new_image;
}

function copy_image(imgA, imgB){
  imgA.copy(imgB, 0, 0, imgB.width, imgB.height, 0, 0, imgA.width, imgA.height);
}

function replace_lines (img1, img2, chunk){
  if(chunk <= 0){
    return;
  }
  for(let i = 1; i <= (width/chunk); i += 2){
    if(i*chunk >= width){
      break;
    }
    
    for(let j = 0; j < chunk; j += 1){
      let temp_ind = (((i*chunk)+ j)*width)*4
      for(let k = 0; k < width*4; k += 4){
        img2.pixels[temp_ind+k] = img1.pixels[temp_ind+k];
        img2.pixels[temp_ind+k+1] = img1.pixels[temp_ind+k+1];
        img2.pixels[temp_ind+k+2] = img1.pixels[temp_ind+k+2];
        img2.pixels[temp_ind+k+3] = img1.pixels[temp_ind+k+3];
      }
    }
  }
  img2.updatePixels();
}

function replace_pixels_hue (img1, img2, hue_val){
  let temp_hue;
  for(let i = 0; i < img2.pixels.length; i += 4){
    temp_hue = calc_hue(img2.pixels[i], img2.pixels[i+1], img2.pixels[i+2]);
    if(abs(temp_hue-hue_val) < 20){
      img2.pixels[i] = img1.pixels[i];
      img2.pixels[i+1] = img1.pixels[i+1];
      img2.pixels[i+2] = img1.pixels[i+2];
    }
  }
  img2.updatePixels();
}

function replace_pixels_key (img, img_ab, key_val){
  
}

function seam_shift(img1, offset = round(img1.width/5), noisy = (random(-1,1)>0), intensity = 1){
  img1.loadPixels();
  let img_copy = createImage(img1.width, img1.height);
  copy_image(img_copy, img1);
  img_copy.loadPixels();
  let seam = []
  if(noisy){
    seam = perlin_seam(img1.height, offset, intensity)
  }
  
  let row_length = img1.width*4;
  for(let i = 0; i < img1.height; i += 1){
    let x_offset = 0;
    if(noisy){
      x_offset = offset-seam[i];
    } else {
      x_offset = offset;
    }
    for(let j = 0; j < row_length; j += 1){
      img1.pixels[i*img1.width*4 + j] = 
        img_copy.pixels[i*row_length +(j+(x_offset*4))%(row_length)];
      
    }
  }

  img1.updatePixels();
}

function perlin_seam(imgWidth, amplitude, intensity = 3){
  
  perlinOffset = [];
  for(let i = 0; i < imgWidth; i += 1){
    let term = (noise(i/(imgWidth/3/intensity)));
    perlinOffset.push(round(map(term, 0, 1, 0, amplitude)));
  }
  return perlinOffset;
}

function rotate_image(img){
  img.loadPixels();
  
  let rotated_pixels = [];
  
  for(let i = 0; i < img.height; i+=1){
    let pixel_row = [];
    for(let j = 0; j < img.width*4; j += 1){
      pixel_row[j] = img.pixels[i*img.width*4 + j];
    }
    rotated_pixels[i] = pixel_row;
  }
  print(rotated_pixels.length, rotated_pixels[0].length)
  
  for(let i = 0; i < img.height; i += 1){
    for(let j = 0; j < img.width; j += 1){
      img.pixels[i*img.width*4 + j*4] = rotated_pixels[(img.height-1)-j][i*4];
      img.pixels[i*img.width*4 + j*4+1] = rotated_pixels[(img.height-1)-j][i*4+1];
      img.pixels[i*img.width*4 + j*4+2] = rotated_pixels[(img.height-1)-j][i*4+2];
      img.pixels[i*img.width*4 + j*4+3] = rotated_pixels[(img.height-1)-j][i*4+3];
    }
  }
  img.updatePixels();
}

function shift_chan(img, val /*amount to shift in pixels*/, chan /*0 = red, 1 = green, 2 = blue*/, dir = 1){
  let channel_values = [];
  let shifted_values = [];
  img.loadPixels();
  
  for(let i = 0; i < img.pixels.length; i += 4){
    channel_values.push(img.pixels[i + chan]);
  }
  if(abs(dir) == 1){
    for(let i = 0; i < img.height; i += 1){
      for(let j = 0; j < img.width; j += 1){
        shifted_values [i*img.width + j] = channel_values[i*img.width + (val + j) % img.width]
      }
    }
  }
  
  if(abs(dir) == 2){
    for(let i = 0; i < img.width; i += 1){
      for(let j = 0; j < img.width; j += 1){
        shifted_values [i*img.width + j] = channel_values[i*img.width + (val + j) % img.width]
      }
    }
  }
  
  let rotated_pixels = [];
  for(let i = 0; i < img.width; i += 1){
    for(let j = 0; i < img.height; j += 1){
      
    }
  }
  
  
  for(i = 0; i < img.pixels.length/4; i += 1){
    img.pixels[i*4+chan] = shifted_values[i];
  }
  
  img.updatePixels();
}

function calc_hue(r, g, b){
  
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

function shuffle_chunks(img, chunk_size = (img.width/3)){
  img.loadPixels();
  let grid_size = img.width/chunk_size
  // let chunks = [];
  
  let pixel_chunks = [];
  
  // create array of empty chunks
  // for(let i = 0; i < grid_size*grid_size; i += 1){
  //   for(let j = 0; j < grid_size; j += 1){
  //     chunks.push(createImage(chunk_size, chunk_size));
  //   }
  // }
  
  // grab chunks from image
  let y = 0;
  let x = 0;
  let w = chunk_size;
  let h = chunk_size;
  for(let l = 0; l < grid_size; l += 1){
    y = l*chunk_size;
    for(let m = 0; m < grid_size; m += 1){
      x = m*chunk_size;
      pixel_chunks.push(grab_chunk(img, x, y, chunk_size, chunk_size));
    }
  }
  
  // shuffle array of chunks
  shuffle(pixel_chunks, true);
  
  // write chunks back to image
  y = 0;
  x = 0;
  for(let l = 0; l < grid_size; l += 1){
    y = l*chunk_size;
    for(let m = 0; m < grid_size; m += 1){
      x = m*chunk_size;
      
      let z = 0;
      for(let i = y; i < y+h; i += 1){
        for(let j = x; j < x+w; j += 1){
          let arr_pos = (i*img.width + j)*4;
          for(let k = 0; k < 4; k += 1){
            img.pixels[arr_pos+k] = pixel_chunks[l*grid_size+m][z];
            z += 1;
          }
        }
      }
    }
  }
  
//   for(let i = 0; i < chunks.length; i += 1){
//     chunks[i].loadPixels();
//     for(let j = 0; j < chunk_size; j += 1){
//       for(let k = 0; k < chunk_size; k += 1){
        
//       }
//     }
//     chunks[i].updatePixels();
//   }
  
  img.updatePixels();
}

class PhotoDNA {
  constructor(bred){
    if(!bred){
      this.img = fetch_image();
    } else {
      this.img = createImage(img_size, img_size);
    }
    this.dna = {};
    generate_dna();
  }
  
  shift_col_chan( val /*amount to shift in pixels*/, chan /*0 = red, 1 = green, 2 = blue*/, dir){
    let channel_values = [];
    let shifted_values = [];

    for(let i = 0; i < this.img.pixels.length; i += 4){
      channel_values.push(this.img.pixels[i + chan]);
    }
    if(abs(dir) == 1){
      for(let i = 0; i < width; i += 1){
        for(let j = 0; j < width; j += 1){
          shifted_values [i*width + j] = channel_values[i*width + (val + j) % width]
        }
      }
    }

    if(abs(dir) == 2){
      for(let i = 0; i < width; i += 1){
        for(let j = 0; j < width; j += 1){
          shifted_values [i*width + j] = channel_values[i*width + (val + j) % width]
        }
      }
    }

    for(i = 0; i < this.img.pixels.length/4; i += 1){
      this.img.pixels[(i*4)+chan] = shifted_values[i];
    }

    this.img.updatePixels();
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
    let con_q = 0;
    let lumin = 0;

    for(let i = 0; i < this.img.pixels.length; i += 4){
      avg_r += this.img.pixels[i];
      avg_g += this.img.pixels[i + 1];
      avg_b += this.img.pixels[i + 2];
      
      if(this.img.pixels[i] > this.img.pixels[i+1]+30 && 
         this.img.pixels[i] > this.img.pixels[i+2]+30)
      //Count pixels that appear red
      {r_pix += 1;}
      
      else if(abs(this.img.pixels[i]-this.img.pixels[i+1])<30 &&
              (this.img.pixels[i]+this.img.pixels[i+1])/2 > (this.img.pixels[i+2]+30))
      //Count pixels that appear yellow
      {y_pix += 1;}
      
      else if(this.img.pixels[i+1] > this.img.pixels[i]+15 && 
               this.img.pixels[i+1] > this.img.pixels[i+2]+15)
      //Count pixels that appear green
      {g_pix += 1;}
      
      else if(abs(this.img.pixels[i+1]-this.img.pixels[i+2])<30 &&
              (this.img.pixels[i+1]+this.img.pixels[i+2])/2 > (this.img.pixels[i]+30))
      //Count pixels that appear cyan
      {c_pix += 1;}
      
      else if(this.img.pixels[i+2] > this.img.pixels[i]+30 && 
               this.img.pixels[i+2] > this.img.pixels[i+1]+30)
      //Count pixels that appear blue
      {b_pix += 1;}
      
      else if(abs(this.img.pixels[i]-this.img.pixels[i+2])<30 &&
              (this.img.pixels[i]+this.img.pixels[i+2])/2 > (this.img.pixels[i+1]+30))
      //Count pixels that appear magenta
      {m_pix += 1;}
      
      
      //calculate average luminance of each pixel
      //luminance formula: (0.2126*R + 0.7152*G + 0.0722*B)
      let temp_key = (0.2126 * this.img.pixels[i] +
                      0.7152 * this.img.pixels[i+1] +
                      0.0722 * this.img.pixels[i+2]);
      
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
    this.dna.avg_r = round(avg_r/(this.img.pixels.length/4));
    //Average Green value 
    this.dna.avg_g = round(avg_g/(this.img.pixels.length/4));
    //Average Blue value 
    this.dna.avg_b = round(avg_b/(this.img.pixels.length/4)); 
    
    this.r_pix = r_pix; //Number of pixels that appear red
    this.y_pix = y_pix;
    this.g_pix = g_pix;
    this.c_pix = c_pix;
    this.b_pix = b_pix;
    this.m_pix = m_pix;
    this.h_key = h_key;
    this.m_key = m_key;
    this.l_key = l_key;
    this.con_q = con_q;
    this.lumin = lumin;

    // print(r_pix, g_pix, b_pix);
    // print(y_pix, c_pix, m_pix);
    // print(h_key, m_key, l_key);
    // print((h_key/m_key)*(l_key/m_key));
    // print(lumin)
  }
}

function calc_CQ(high_con, low_con, total){
  let mid_con = total - (high_con + low_con);
  print((high_con/mid_con)*(low_con/mid_con));
}
