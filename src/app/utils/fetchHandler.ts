class ResponseError extends Error {
    response: Response
    constructor(message: string, res: Response){
        super(message)
        this.response = res
    }
}


// FIXME: https://github.com/microsoft/TypeScript/issues/27987#issuecomment-633251814
async function safeFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined, isJSON?: T): Promise<T extends false ? Response : any>
async function safeFetch(input: RequestInfo | URL, init?: RequestInit | undefined, isJSON: boolean = true) {
    const response = await fetch(input, init)
    if(!response.ok) {throw new ResponseError("Response not OK", response)}
    if(isJSON) return await response.json()
    else return response
}


// Server component only?
function reactFetch(input: RequestInfo | URL, init?: RequestInit | undefined, isJSON: boolean = true){
    let status: "pending" | "success" | "error" = "pending"
    let result: Object | Response
    const fetching = fetch(input, init).then(
        (r) => {
            if(!r.ok){
                status = "error"
                throw new ResponseError("Response not OK", r)
            }
            status = "success"
            if(isJSON){
                r.json().then(
                    (obj) => {
                        result = obj
                    },
                    (err) => {
                        status = "error"
                        result = err
                    }
                )
            } else result = r
        }, 
        (e) => {
            status = "error"
            result = e
        }
    )
    return () => {
        if(status === "pending") throw fetching
        else if(status === "error") throw result
        else return result
    }
}

export {ResponseError, safeFetch, reactFetch}