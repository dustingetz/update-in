let clone = (xs) => xs.slice(0);

function butLast (xs) {
  let xxs = clone(xs);
  xxs.pop();
  return xxs;
}

function last (xs) {
  return xs[xs.length-1];
}

export default function apply (f, ...args) {
  // last arg can be a seq of more args
  args = [].concat(butLast(args), last(args));
  return f.apply(null, args);
};
