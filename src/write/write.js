
export default (
    (
      fd,
      
      cursor,response,
      
      block_size,entry_length,
      
      block_id,limit,
      
      from,to,
      
      read,write,check,iter,cond,r,cb,
    ) => {
        var
            found = 0,

            final_write_cb = (
                (_) => {
                    return (
                        cb(r,limit,response)
                    )
                }
            ),

            write_cb = (
                (_) => {
                    return (
                        check(from,to)
                        ? (
                            (block_id++),
                            read(fd,cursor,0,block_size,(from=iter(from,block_size)),read_cb)
                        )
                        : cb(r,found,response),

                        undefined
                    );
                }
            ),

            read_cb = (
                (_,block_size) => {
                    a: {
                        for (
                            var
                                prev_found = found,
                                i = 0
                            ;
                            i<block_size;
                            i+=entry_length
                        ) {
                            if (
                                cond(r, cursor,response, i,entry_length, found,limit, block_id)
                                &&
                                ((++found) === limit)
                            ) {
                                (found > prev_found)
                                ? write(fd, cursor, 0, block_size, from, final_write_cb)
                                : cb(r,limit,response);
                                break a;
                            }
                        };

                        (found > prev_found)
                        ? write(fd, cursor, 0, block_size, from, write_cb);
                        : write_cb(null)
                    }
                    return undefined;
                }
            )
        ;
        return (
            read(fd,cursor,0,block_size,from,read_cb),
            undefined
        );
    }
);
