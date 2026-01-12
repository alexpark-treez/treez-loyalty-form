"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip } from "@/components/InfoTooltip";
import { FormData } from "@/lib/schema";

interface BusinessInfoStepProps {
  form: UseFormReturn<FormData>;
}

export function BusinessInfoStep({ form }: BusinessInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Business Information</h2>
        <p className="text-muted-foreground">
          Tell us about your dispensary and how to contact you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dispensaryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Dispensary Name
                <InfoTooltip content="The official business name of your dispensary" />
              </FormLabel>
              <FormControl>
                <Input placeholder="Green Leaf Dispensary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Contact Name
                <InfoTooltip content="The primary person we should contact about your loyalty program" />
              </FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Contact Email
                <InfoTooltip content="We'll send updates and confirmations to this email" />
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Website
                <InfoTooltip content="Your dispensary's website URL (include https://)" />
              </FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How Many Stores?
                <InfoTooltip content="Total number of retail locations in your operation" />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transferringPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Transferring Existing Loyalty Points?
                <InfoTooltip content="Are you migrating from another loyalty system with existing customer points?" />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
