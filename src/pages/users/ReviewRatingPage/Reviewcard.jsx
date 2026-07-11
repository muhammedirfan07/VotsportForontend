import React from 'react'
import { Star } from 'lucide-react';
import { format } from "timeago.js";
const Reviewcard = ({review }) => {
  return (
    <>
        <div className="px-4 py-3 shadow  bg-card border border-border rounded-xl  text-foreground ">
                  <div className="items-center gap-2 mb-2">
                <div className=' flex justify-between'>
                    <div className=' flex gap-2 mb-2'> 
                      <div  className=' w-8 h-8 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center'>
                        {review?.user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                        <h3 className="font-medium text-lg mb-2">{review?.user?.fullName || "Anonymous"}</h3>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>{format(review?.createdAt)}</p>
                        </div>
                </div>
                    <div className="flex ps-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review?.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="ps-1 text-muted-foreground text-sm">
                    {review?.review}
                  </p>
                </div>
    </>
  )
}

export default Reviewcard