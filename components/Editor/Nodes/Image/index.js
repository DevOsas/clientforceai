// import { Node, Plugin } from 'tiptap'

// export default class Image extends Node {
//   get name() {
//     return 'image'
//   }

//   get schema() {
//     return {
//       inline: false,
//       attrs: { src: { default: '' }, alt: { default: '' } },
//       parseDOM: [
//         { tag: 'img', getAttrs: (dom) => ({ src: dom.src, alt: dom.alt }) },
//       ],
//       toDOM: (node) => ['img', node.attrs],
//     }
//   }

//   commands({ type }) {
//     return (attrs) => (state, dispatch) => {
//       const { selection } = state
//       const node = type.create(attrs)

//       const isEmptyLine =
//         this.editor.view.domAtPos(state.selection.$anchor.pos).node
//           .innerHTML === '<br>'

//       let transaction
//       if (isEmptyLine) {
//         const resolvedPos = state.doc.resolve(selection.head)
//         const pos = resolvedPos.before(resolvedPos.depth)

//         transaction = state.tr.replaceWith(
//           pos,
//           pos + resolvedPos.parent.nodeSize,
//           node
//         )
//       } else {
//         const position = selection.$cursor
//           ? selection.$cursor.pos
//           : selection.$to.pos
//         transaction = state.tr.insert(position, node)
//       }
//       dispatch(transaction)
//     }
//   }

//   deleteNode() {
//     const tr = this.view.state.tr
//     const pos = this.getPos()
//     tr.delete(pos, pos + this.node.nodeSize)
//     this.view.dispatch(tr)
//   }

//   get plugins() {
//     return [
//       new Plugin({
//         props: {
//           handleDOMEvents: {
//             drop(view, event) {
//               const hasFiles =
//                 event.dataTransfer &&
//                 event.dataTransfer.files &&
//                 event.dataTransfer.files.length

//               if (!hasFiles) {
//                 return
//               }

//               const images = Array.from(event.dataTransfer.files).filter(
//                 (file) => /image/i.test(file.type)
//               )

//               if (images.length === 0) {
//                 return
//               }

//               event.preventDefault()

//               const { schema } = view.state
//               const coordinates = view.posAtCoords({
//                 left: event.clientX,
//                 top: event.clientY,
//               })

//               images.forEach((image) => {
//                 const reader = new FileReader()

//                 reader.onload = (readerEvent) => {
//                   const node = schema.nodes.image.create({
//                     src: readerEvent.target.result,
//                   })
//                   const transaction = view.state.tr.insert(
//                     coordinates.pos,
//                     node
//                   )
//                   view.dispatch(transaction)
//                 }
//                 reader.readAsDataURL(image)
//               })
//             },
//           },
//         },
//       }),
//     ]
//   }
// }
