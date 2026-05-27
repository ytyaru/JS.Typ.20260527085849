const isO = v => null !== v && 'object' === typeof v;

const isBrokenObject = v => {
  if (!isO(v)) return false;
  
  const proto = Object.getPrototypeOf(v);
  if (null === proto) return false;

  // インスタンス自身（独自プロパティ）に constructor が直接生えている場合
  if (Object.prototype.hasOwnProperty.call(v, 'constructor')) {
    // プロトタイプ側から継承されるべき本来の constructor と一致しない（＝上書きされている）なら破綻
    if (v.constructor !== proto.constructor) return true;
  }

  // プロトタイプチェーンから取れる constructor の検証
  const c = v.constructor;
  if (typeof c !== 'function') return true;
  if (!('name' in c) || c.name === '') return true;

  return false;
};

// --- アサーション確認（すべてパスします） ---
console.assert(false===isBrokenObject(Object.create(null)));
console.assert(true===isBrokenObject({constructor:null}));
console.assert(true===isBrokenObject({constructor:()=>{}}));
console.assert(true===isBrokenObject({constructor:function(){}}));
console.assert(true===isBrokenObject({constructor:function fn(){}})); // パスします
console.assert(false===isBrokenObject(class C{}));
console.assert(false===isBrokenObject(new (class C{})())); 
console.assert(false===isBrokenObject({})); 
console.assert(false===isBrokenObject(1));
console.assert(false===isBrokenObject(null));
console.assert(false===isBrokenObject(undefined));
console.assert(false===isBrokenObject(NaN));

