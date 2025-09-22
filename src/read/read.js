
export default (
    (
      fd,
      
      c,s,
      
      bs,el,
      
      block_id,limit,
      
      from,to,
      
      read,check,iter,cond,r,cb,
    ) => {
      var
        found = 0,

        read_cb = (
          (_,bs) => {
            a: {
              for (
                var
                  i = 0
                ;
                i<bs;
                i+=el
              ) {
                if (
                  cond(r, c,s, i,el, found,limit, block_id)
                  &&
                  ((++found) === limit)
                ) {
                  cb(r,limit,s);
                  break a;
                }
              };

              check(from,to)
              ? (
                (block_id++),
                read(fd,c,0,bs,(from=iter(from,bs)),read_cb)
              )
              : cb(r,found,s);
            }
            return undefined;
          }
        )
      ;
      return (
        read(fd,c,0,bs,from,read_cb),
        undefined
      );
    }
);
