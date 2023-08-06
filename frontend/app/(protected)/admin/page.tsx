"use client";

import { URLDataType } from "@/app/api/import/_lib/import-types";
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

const fileTypeOptions: Option[] = [
  { value: URLDataType.webpage, label: "Web Page URL" },
  { value: URLDataType.pdf, label: "PDF File URL" },
  { value: URLDataType.youtube_video, label: "Youtube Video URL" },
  { value: URLDataType.csv, label: "CSV File URL" },
  { value: URLDataType.website, label: "Website Domain URL" },
  { value: URLDataType.drive_file, label: "Google Drive File ID" },
  { value: URLDataType.drive_folder, label: "Google Drive Folder ID" },
];

const organizationOptions = [
  { value: "tmfc", label: "Tim Morehouse Fencing Club" },
  { value: "test", label: "Testing" },
];

const datastoreOptions = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
];

type Option = {
  value: URLDataType;
  label: string;
};

interface IFormInput {
  url: string;
  file_type: URLDataType;
  organization: string;
  datastore: string;
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
    const res = await fetch("/api/datasources/insert", {
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
                <Label htmlFor="url">URL</Label>
                <Input
                  placeholder="Enter upload file URL"
                  {...register("url", { required: true })}
                />
                {errors.url && (
                  <span className="text-red-700">This field is required</span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="file_type">URL File Type</Label>
                <Controller
                  control={control}
                  name="file_type"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        onValueChange={(str) =>
                          field.onChange(str as URLDataType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select File Type" />
                          <SelectContent position="popper">
                            {fileTypeOptions.map((option) => (
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="organization">Organization</Label>
                <Controller
                  control={control}
                  name="organization"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        onValueChange={(str) =>
                          field.onChange(str as URLDataType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Organization" />
                          <SelectContent position="popper">
                            {organizationOptions.map((option) => (
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="datastore">Data Store</Label>
                <Controller
                  control={control}
                  name="datastore"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        onValueChange={(str) =>
                          field.onChange(str as URLDataType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select File Type" />
                          <SelectContent position="popper">
                            {datastoreOptions.map((option) => (
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
