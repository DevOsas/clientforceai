// import { Node } from 'tiptap'

// import VidcaptionView from './View'

// export default class Vidcaption extends Node {
//   get name() {
//     return 'vidcaption'
//   }

//   get schema() {
//     return {
//       attrs: {
//         contenteditable: {
//           default: true,
//         },
//       },
//       content: 'inline*',
//       group: 'video_figure',
//       toDOM: (node) => [
//         'figcaption',
//         {
//           'data-content': 'video',
//         },
//         0,
//       ],
//       parseDOM: [
//         {
//           tag: 'figcaption[data-content="video"]',
//           getAttrs: (dom) => {
//             return { 'data-content': 'video' }
//           },
//         },
//       ],
//     }
//   }

//   get view() {
//     return VidcaptionView
//   }
// }
