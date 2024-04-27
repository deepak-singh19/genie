"use client"
import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {Input} from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./mediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
// import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import InsufficientCreditsModal from '../shared/InsufficientCreditsModal';
import { TransformationFormProps, Transformations } from "@/types"

 
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
})

const TransformationForm = ({action, data= null, type, userId,creditBalance, config=null}: TransformationFormProps) => {

  // console.log("Initial Data", data);

  const transformationType= transformationTypes[type];

  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting]= useState(false)
  const [isTransforming, setIsTransforming]= useState(false)
  const [transformationConfig, setTransformationConfig]= useState(config)
  const[isPending, startTransition]= useTransition()
  const router = useRouter();

  const initialValues = data && action == 'Update' ? {
    title:data?.title,
    aspectRatio:data?.aspectRatio,
    color:data?.color,
    prompt:data?.prompt,
    publicId:data?.publicId,

  }: defaultValues;

  //Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // console.log("Data ",data)
    // console.log("Image ",image)

    if(data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId || "",
        ...transformationConfig
      })

      // const imageData= {
      //   title: values.title,
      //   publicId: image?.publicId,
      //   transformationType: type,
      //   width: image?.width,
      //   height: image?.height,
      //   config: transformationConfig,
      //   secureURL: image?.secureURL, // Provide a default value or handle asynchronously
      //   transformationURL: transformationUrl,
      //   aspectRatio: values.aspectRatio,
      //   prompt: values.prompt,
      //   color: values.color,
      // };
      const imageData = {
        title: values.title,
        publicId: image?.publicId || "", // Provide a default value of an empty string if image?.publicId is undefined
        transformationType: type,
        width: image?.width || 0, // Provide a default value of 0 if image?.width is undefined
        height: image?.height || 0, // Provide a default value of 0 if image?.height is undefined
        config: transformationConfig,
        secureURL: image?.secureURL || "", // Provide a default value of an empty string if image?.secureURL is undefined
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      console.log("Image Data", imageData);
      console.log("URL", image?.secureURL);

      

      if(action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }

      if(action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data?._id
            },
            userId,
            path: `/transformations/${data?._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    setIsSubmitting(false)
  }

  const onSelectFieldHandler = (value: string, onChangeField:(value:string)=>void)=>{
    const imageSize= aspectRatioOptions[value as AspectRatioKey];

    setImage((prevImg:any)=>({
      ...prevImg,
      aspectRatio: imageSize.aspectRatio,
      width:imageSize.width,
      height:imageSize.height

    }))

    setNewTransformation(transformationType.config)

    return onChangeField(value);

  }

  const onInputChangeHandler=(field:string, value:string, type:string, onChangeField: (value:string)=>void)=>{
    debounce(()=>{
      setNewTransformation((pre:any)=>({
        ...pre,
        [type]:{
          ...pre?.[type],
          [field==="prompt"?"prompt":"to"]:value
        }
      }));
      
    },1000)();
    return onChangeField(value);

  }

  const onTransformHandler=async()=>{
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    setNewTransformation(null);

    startTransition(async()=>{
      await updateCredits(userId, -1);
    })

  }

  useEffect(()=>{
    if(image && (type === 'restore' || type === 'removeBackground')){
      setNewTransformation(transformationType.config)
    }
  },[image, transformationType.config,type])
  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal/>}
        <CustomField control={form.control} name="title" formLabel="Image Title" className="w-full" render={({field})=><Input {...field} className="input-field"/>} />

        {type === 'fill' &&(
          <CustomField
          
              render={({ field }) => (
                <Select onValueChange={(value)=>onSelectFieldHandler(value, field.onChange)} value={field.value}>
                  <SelectTrigger className="select-field">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(aspectRatioOptions).map((key)=>(
                      <SelectItem key={key} value={key} className="select-item">
                        {aspectRatioOptions[key as AspectRatioKey].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} control={form.control} name={"aspectRatio"} className="w-full" formLabel="Ascept Ratio"          />
        )}

        {(type=== 'remove' || type==='recolor') && (
          <div className="prompt-field">
            <CustomField
            control={form.control}
            name="prompt"
            formLabel={type === "remove" ? 'Object to remove': 'Object to recolor'}
            className=""
            render={({field})=>(
              <Input
              value={field.value}
              className="input-field"
              onChange={(e)=>onInputChangeHandler('prompt', e.target.value, type,field.onChange)}

              />
            )}
            />

            {type==='recolor' &&(
              <CustomField
              control={form.control}
              name="color"
              formLabel="Replacement Color"
              className="w-full"
              render={({field})=>(
                <Input
                value={field.value}
                className="input-field"
                onChange={(e)=>onInputChangeHandler('color', e.target.value, 'recolor',field.onChange)}
  
                />

              )}

              />
            )}

          </div>
        )}

        <div className="media-uploader-field">
          <CustomField 
            control={form.control} 
            name="publicId" 
            className="flex size-full flex-col"
            render={({field})=>(
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}/>
            )}/>

            <TransformedImage
              image={image}
              type={type}
              title={form.getValues().title}
              isTransforming={isTransforming}
              setIsTransforming={setIsTransforming}
              transformationConfig={transformationConfig}/>

        </div>

        <div className="flex flex-col gap-4">
        <Button 
        type="button"
        className="submit-button capitalize"
        disabled={isTransforming || newTransformation=== null}
        onClick={onTransformHandler}
        >
          {isTransforming?"Transforming...":"Apply Transformation"}</Button>
        </div>

        <Button 
        type="submit"
        className="submit-button capitalize"
        disabled={isSubmitting}
        >
          {isSubmitting?"Submitting":"Save Image"}</Button>
        
      </form>
    </Form>
    </div>
  )
}

export default TransformationForm