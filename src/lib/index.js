// const esprima = require('esprima');
// const { Result } = require('./Result');

// const parseAstIter = (ast, initialAcc = {}) => {
//   const acc = {
//     result: Result.empty(),
//     bindings: {},
//     ...initialAcc,
//   };

//   if (!ast) {
//     return acc;
//   }

//   switch (ast.type) {
//     case 'Program':
//       return ast.body.reduce(
//         (bodyAcc, bodyAst) => parseAstIter(bodyAst, bodyAcc),
//         acc);

//     case 'ExpressionStatement':
//       return parseAstIter(ast.expression, acc);

//     case 'CallExpression': {
//       const calleeAcc = parseAstIter(ast.callee, { ...acc, result: Result.empty() });
//       const argsAcc = ast.arguments.reduce(
//         (tmpAcc, bodyAst) => {
//           const nonArgAcc = parseAstIter(bodyAst, tmpAcc);
//           return { ...nonArgAcc, result: Result.arguments(nonArgAcc.result) };
//         },
//         { ...calleeAcc, result: Result.empty() });

//       return {
//         ...argsAcc,
//         result: acc.result.concat(calleeAcc.result.concat(argsAcc.result)),
//       };
//     }
//     case 'MemberExpression': {
//       if (ast.computed) {
//         return acc;
//       }

//       if (ast.object.type === 'Identifier' && ast.object.name === 'vim') {
//         if (ast.property.type === 'Identifier' && ['echo', 'echom', 'execute'].includes(ast.property.name)) {
//           return {
//             ...acc,
//             result: Result.commandName(ast.property.name),
//           };
//         }
//       }

//       throw new Error('parseAstIter() not implemented for type = MemberExpression');
//     }
//     case 'BinaryExpression': {
//       const leftAcc = parseAstIter(ast.left, { ...acc, result: Result.empty() });
//       const rightAcc = parseAstIter(ast.right, { ...leftAcc, result: Result.empty() });
//       return {
//         ...rightAcc,
//         result: Result.binaryExpression({
//           operator: ast.operator,
//           left: leftAcc.result,
//           right: rightAcc.result
//         }),
//       };
//     }
//     case 'ObjectExpression': {
//       const propsAcc = ast.properties.reduce(
//         (tmpAcc, propAst) => {
//           const nonPropsAcc = parseAstIter(propAst, tmpAcc);
//           return { ...nonPropsAcc, result: Result.properties(nonPropsAcc.result) };
//         },
//         { ...acc, result: Result.empty() }
//       );

//       return {
//         ...propsAcc,
//         result: acc.result.concat(Result.objectExpression({ properties: propsAcc.result })),
//       };
//     }
//     case 'Literal': {
//       const valueType = typeof ast.value;
//       if (valueType === 'string') {
//         return { ...acc, result: acc.result.concat(Result.string(ast.value)) };
//       }
//       if (valueType === 'number') {
//         return { ...acc, result: acc.result.concat(Result.number(ast.value)) };
//       }
//       throw new Error(`parseAstIter() not implemented for type = Literal, typeof value = ${valueType}`);
//     }
//     default:
//       throw new Error(`parseAstIter() Not implemented for type = ${ast.type}`);
//   }
// };

// const parseAst = ast => parseAstIter(ast).result;

// const parse = program => parseAst(esprima.parse(program));

import * as cmd from './cmd';

export default { cmd };
