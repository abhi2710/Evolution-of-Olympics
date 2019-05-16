let getClosest = (a,b,target)=>{
    if((target - a) <= (b - target)){
        return a;
    }
    return b;
}

let findClosest = (arr,target) => {
    let n = arr.length;
    let i=0,j=n,mid;

    if(target < arr[i]){
        return arr[i];
    }
    if(target > arr[j]){
        return arr[j]
    }
    while (i<j){
        mid = parseInt((j+i)/2);

        if(target == arr[mid]){
           break;
        }
        else if(target < arr[mid]){

            if(mid>0 && target>arr[mid-1]){
                return getClosest(arr[mid-1],arr[mid],target)
            }

            j = mid
        }
        else{

            if(mid<n-1 && target<arr[mid+1]){
                return getClosest(arr[mid],arr[mid+1],target)
            }

            i = mid + 1;

        }
    }
    return arr[mid];
}
