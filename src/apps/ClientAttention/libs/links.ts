export const pages =  (data:any,modelo:string,count:number,totalCount:number |string,limit: string) =>{
    let sig:string = '';
    let prev:string = '';
    if(count !== totalCount){
        if(data[count-1].id < totalCount){
            if(count>totalCount){
                sig = `http://localhost:81/api/${modelo}/?offset=${parseInt(data[count-1].id)}`;
            }else{
                sig = `http://localhost:81/api/${modelo}/?offset=${parseInt(data[count-1].id)}&limit=${
                    limit ? limit : count}`;
            }
        }else{
            sig = "Last page";
        }
        if(data[0].id > count){
            prev = `http://localhost:81/api/${modelo}/?offset=${parseInt(data[0].id)-(parseInt(limit)+1)}&limit=${
                limit ? limit : count}`;
        }else{
            if(data[0].id > 1 ){
                prev = `http://localhost:81/api/${modelo}/?limit=${limit}`;
            }else{
                prev = "First Page";
            }
            
        }
    }else{
        sig = "Last page";
        prev = "First Page";
    }
    return {sig,prev};
}

export const records = (data:any,modelo:string,count:number) => {
    let sig:string = '';
    let prev: string = '';
    if(data.id<count){
        sig = `http://localhost:81/api/${modelo}/${parseInt(data.id)+1}`;
    }else{
        sig = "Last record";
    }
    if(data.id>1){
        prev = `http://localhost:81/api/${modelo}/${parseInt(data.id)-1}`;
    }else{
        prev = "First Record";
    }
    return {sig,prev};
}

export const created = (model:string,id:string | number) =>{
    return `http://localhost:81/api/${model}/${id}`;
}