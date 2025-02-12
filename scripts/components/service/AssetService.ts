// class AssetService {
//   private readonly PLAYER_IMAGE_PATH = "./dist/images/player.png";

//   constructor() {}

//   async test(): Promise<[]> {
//     const playerPromise = this.loadPlayerImage();
//     const playerPromise2 = this.loadPlayerImage();

//     const p = await Promise.all([playerPromise, playerPromise2]).then(
//       (values) => {
//         return values;
//       }
//     );
//     //   .catch((reason) => {
//     //     return [];
//     //   });

//     return [];
//   }

//   async loadPlayerImage(): Promise<HTMLImageElement> {
//     return new Promise((resolve, reject) => {
//       const sprite = new Image();
//       sprite.onload = () => resolve(sprite);
//       sprite.src = this.PLAYER_IMAGE_PATH;
//     });
//   }
// }

// //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

//  ============================================================

// TODO: Image() needs time to load. figure out a way to give it time to complete
//   private setSprite(): Sprite {
//     const sprite = new Image();
//     sprite.src = this.SPRITE_LOCATION;

//     // console.log("start");
//     // let lock: boolean = true;
//     // setTimeout(() => {
//     //   lock = false;
//     //   console.log(`set lock to: ${lock}`);
//     // }, 1000);

//     // // while (lock) {
//     // //   //wait
//     // // }
//     // console.log("end");

//     /*
// https://www.geeksforgeeks.org/how-to-wait-n-seconds-in-javascript/
// https://www.google.com/search?q=how+to+call+async+function+in+typescript+class+constructor&sca_esv=a7efe55fedd440ee&rlz=1C1CHBD_enUS911US911&ei=jxisZ-fBJNir5NoP6_vqSA&ved=0ahUKEwinxZTOm72LAxXYFVkFHeu9GgkQ4dUDCBA&uact=5&oq=how+to+call+async+function+in+typescript+class+constructor&gs_lp=Egxnd3Mtd2l6LXNlcnAiOmhvdyB0byBjYWxsIGFzeW5jIGZ1bmN0aW9uIGluIHR5cGVzY3JpcHQgY2xhc3MgY29uc3RydWN0b3IyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGKsCMgUQIRirAjIFECEYqwJIjVtQtydYhVlwAngBkAEAmAF1oAGmDKoBBDE2LjK4AQPIAQD4AQGYAhOgAocMwgIKEAAYsAMY1gQYR8ICChAhGKABGMMEGArCAggQIRigARjDBMICBRAhGJ8FmAMAiAYBkAYIkgcEMTcuMqAHmGA&sclient=gws-wiz-serp
// https://www.google.com/search?q=javascript+HtmlImageElement+wait+to+load+image&rlz=1C1CHBD_enUS911US911&oq=javascript+HtmlImageElement+wait+to+load+image&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRirAjIHCAUQIRirAjIHCAYQIRiPAtIBCTExMzk5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8&sei=qBasZ9SZIJ2v5NoPj-rI2AE

// */

//     const spriteHeight = sprite.height;
//     const spriteWidth = sprite.width;

//     console.log({ sprite });

//     const maxHeight = Math.min(this.SPRITE_MAX_HEIGHT, spriteHeight);
//     console.log({ spriteH: spriteHeight });

//     const aspectRatio = maxHeight < spriteHeight ? maxHeight / spriteHeight : 1;
//     console.log({ aspectRatio });

//     const maxWidth = spriteWidth * aspectRatio;
//     console.log({ spriteW: spriteWidth });

//     console.log({
//       image: sprite,
//       width: maxWidth,
//       height: maxHeight,
//     });

//     return {
//       image: sprite,
//       width: maxWidth,
//       height: maxHeight,
//     };
//   }
