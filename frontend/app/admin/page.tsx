"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const options = [
  { value: "webpage", label: "Web Page URL" },
  { value: "pdf", label: "PDF URL" },
  { value: "youtube_video", label: "Youtube Video URL" },
];

enum FileTypeEnum {
  webpage = "webpage",
  pdf = "pdf",
  youtube_video = "youtube_video",
}

interface IFormInput {
  url: String;
  file_type: FileTypeEnum;
}

export default function Admin() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    const res = await fetch("/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(res);
  };

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Add Custom Data</CardTitle>
            <CardDescription>Add data for additional context</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">URL</Label>
                <Input
                  placeholder="Enter upload file URL"
                  {...register("url", { required: true })}
                />
                {errors.url && (
                  <span className="text-red-700">This field is required</span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">URL File Type</Label>
                <Controller
                  control={control}
                  name="file_type"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        onValueChange={(str) =>
                          field.onChange(str as FileTypeEnum)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select File Type" />
                          <SelectContent position="popper">
                            {options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="reset">
              Cancel
            </Button>
            <Button type="submit">Import</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
