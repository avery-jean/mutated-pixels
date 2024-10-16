let grid_sizes = [2,3,4,5,6,8]

function shuffle_chunks(img, grid_size = grid_sizes[floor(random(0, grid_sizes.length))]
                        ){
  img.loadPixels();
  let chunk_size = img.width/grid_size;
  
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

function shuffle_channels(img, chan){
  let channels = []
  channels[0] = rip_channel(img, 0);
  channels[1] = rip_channel(img, 1);
  channels[2] = rip_channel(img, 2);
  
  if(chan[0]){
    shuffle_chunks(channels[0]);
  }
  if(chan[1]){
    shuffle_chunks(channels[1]);
  }
  if(chan[2]){
    shuffle_chunks(channels[2]);
  }
  
  img.set(0, 0,compile_channels(channels));
}

function rip_channel(img1, channel){
  if(0 > channel > 3){
    return;
  }
  
  img1.loadPixels();
  let chan_rip = createImage(img_size, img_size);
  chan_rip.loadPixels();
  
  for(let i = 0; i < img1.pixels.length; i += 4){
    chan_rip.pixels[i+channel] = img1.pixels[i+channel];
    chan_rip.pixels[i+3] = img1.pixels[i+3];
  }
  
  chan_rip.updatePixels();
  return chan_rip;
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

function replace_channel(img1, img_src, channel){
  if(0 > channel > 3){
    return;
  }
  
  img1.loadPixels();
  img_src.loadPixels();
  
  for(let i = 0; i < img1.pixels.length; i += 4){
    img1.pixels[i+channel] = img_src.pixels[i+channel];
  }
  
  img1.updatePixels();
}

function replace_pixels_key(img1, img2, val_set){
  img1.loadPixels();
  img2.loadPixels();
  let temp_img = createImage(img1.width, img1.height);
  let temp_key;
  temp_img.set(0, 0, img1);
  temp_img.loadPixels();
  for(let i = 0; i < img1.pixels.length; i += 4){
    temp_key = get_key(img1.pixels[i], img1.pixels[i+1], img1.pixels[i+2]);
    if(abs(temp_key-val_set[0]) < val_set[1]){
      for(let k = 0; k < 4; k += 1){
        temp_img.pixels[i+k] = img2.pixels[i+k];
      }
    }
  }
  temp_img.updatePixels();
  img1.set(0, 0, temp_img);
}

function write_chunk(img1, img2, val_set){
  let chunk = grab_chunk(img2, val_set[2], val_set[3], val_set[0], val_set[1]);
  img1.loadPixels();
  
  let i,j,k,z = 0;
  for(i = val_set[5]; i < val_set[5]+val_set[1]; i += 1){
    for(j = val_set[4]; j < val_set[4]+val_set[0]; j += 1){
      let arr_pos = (i*img1.width + j)*4;
      for(k = 0; k < 4; k += 1){
        img1.pixels[arr_pos+k] = chunk[z];
        z += 1;
      }
    }
  }
  img1.updatePixels();
}

function grab_chunk(img, x, y, w, h){
  let i,j,k = 0;
  let img_chunk = [];
  img.loadPixels();
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

function replace_pixels_hue(img1, img2, vals){
  //vals is a set of two integers, vals[0] is hue, vals[1] is threshold
  img1.loadPixels();
  img2.loadPixels();
  let temp_img = createImage(img1.width, img1.height);
  temp_img.set(0, 0, img1);
  temp_img.loadPixels();
  
  let temp_hue;
  let temp_key;
  let red_shift = 0;
  if(vals[0] === 0){
    red_shift = 60;
  }
  let hue_min = (vals[0]-vals[1])+red_shift;
  let hue_max = (vals[0]+vals[1])+red_shift;
  
  let is_hue = false;
  let is_bright = false;
  
  for(let i = 0; i < temp_img.pixels.length; i += 4){
    temp_hue = (red_shift + calc_hue(temp_img.pixels[i], temp_img.pixels[i+1], temp_img.pixels[i+2]))%360;
    temp_key = get_key(img1.pixels[i], img1.pixels[i+1], img1.pixels[i+2]);
    is_hue= ((hue_min<temp_hue)&&(temp_hue<hue_max));
    is_bright = ((temp_key > 38)&& (temp_key < 242));
    
    if(is_hue&&is_bright){
      temp_img.pixels[i] = img2.pixels[i];
      temp_img.pixels[i+1] = img2.pixels[i+1];
      temp_img.pixels[i+2] = img2.pixels[i+2];
    }
  }
  temp_img.updatePixels();
  img1.set(0, 0, temp_img)
}

function remove_pixels_hue(img, vals){
  img.loadPixels();
  let temp_img = createImage(img.width, img.height);
  temp_img.set(0, 0, img);
  temp_img.loadPixels();
  
  let temp_hue;
  let temp_key;
  let red_shift = 0;
  if(vals[0] === 0){
    red_shift = 60;
  }
  let hue_min = (vals[0]-vals[1])+red_shift;
  let hue_max = (vals[0]+vals[1])+red_shift;
  
  let is_hue = false;
  let is_bright = false;
  
  for(let i = 0; i < temp_img.pixels.length; i += 4){
    temp_hue = (red_shift + calc_hue(temp_img.pixels[i], temp_img.pixels[i+1], temp_img.pixels[i+2]))%360;
    temp_key = get_key(temp_img.pixels[i], temp_img.pixels[i+1], temp_img.pixels[i+2]);
    is_hue= ((hue_min<temp_hue)&&(temp_hue<hue_max));
    is_bright = ((temp_key > 38)&& (temp_key < 242));
    
    if(is_hue&&is_bright){
      temp_img.pixels[i] = 0;
      temp_img.pixels[i+1] = 0;
      temp_img.pixels[i+2] = 0;
    }
  }
  temp_img.updatePixels();
  img.set(0, 0, temp_img)
}

function seam_shift(img1, offset = round(img1.width/5), noisy = (random(-1,1)>0), intensity = random(0,3)){
  img1.loadPixels();
  let img_copy = createImage(img1.width, img1.height);
  img_copy.set(0, 0, img1);
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

function perlin_seam(imgWidth, amplitude, intensity){
  
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

function shift_channel(img, offset, chan, noisy){
  let channel_values = [];
  let shifted_values = [];
  
  let image_copy = createImage(img.width, img.height);
  image_copy.set(0, 0, img);
  seam_shift(image_copy, offset, noisy, ceil(random(0, 10)))
  img.loadPixels();
  image_copy.loadPixels();
  
  for(let i = 0; i < img.pixels.length; i += 4){
    shifted_values.push(image_copy.pixels[i + chan]);
  }
  // for(let i = 0; i < img.height; i += 1){
  //   for(let j = 0; j < img.width; j += 1){
  //     shifted_values [i*img.width + j] = channel_values[i*img.width + (val + j) % img.width]
  //   }
  // }
  
  for(i = 0; i < img.pixels.length/4; i += 1){
    img.pixels[i*4+chan] = shifted_values[i];
  }
  
  img.updatePixels();
}

function get_key(R, G, B){
  let temp = (0.2126 * R) +
  (0.7152 * G) +
  (0.0722 * B);
  return temp;
}