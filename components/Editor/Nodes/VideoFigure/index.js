// import { Node } from 'tiptap'
// import { Plugin } from 'prosemirror-state'

// import VideoFigureView from './View'

// export default class VideoFigure extends Node {
//   get name() {
//     return 'video_figure'
//   }

//   get schema() {
//     return {
//       attrs: {
//         class: {
//           default: 'is-center',
//         },
//       },
//       content: 'video vidcaption',
//       group: 'block',
//       parseDOM: [
//         {
//           tag: 'figure[data-content="video"]',
//           getAttrs: (dom) => {
//             return { 'data-content': 'video' }
//           },
//         },
//       ],
//       toDOM: (node) => [
//         'figure',
//         {
//           'data-content': 'video',
//         },
//         0,
//       ],
//     }
//   }

//   get view() {
//     return VideoFigureView
//   }

//   // Deletes the entire figure node if videoNode is empty.
//   get plugins() {
//     return [
//       new Plugin({
//         appendTransaction: (transactions, oldState, newState) => {
//           const tr = newState.tr
//           let modified = false
//           // TO-DO: Iterate through transactions instead of descendants.
//           newState.doc.descendants((node, pos, parent) => {
//             if (node.type.name !== 'video_figure') return
//             const videoNode = node.firstChild

//             if (videoNode.attrs.src === videoNode.type.defaultAttrs.src) {
//               tr.deleteRange(pos, pos + node.nodeSize)
//               modified = true
//             }
//           })
//           if (modified) return tr
//         },
//       }),
//     ]
//   }
// }
