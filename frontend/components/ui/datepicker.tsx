'use client';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { PopoverTrigger, Popover, PopoverContent } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { cn } from '../../lib/utils';
import React from 'react';

interface CalendarProps {
  field: ControllerRenderProps<any, string>;
}

export const DatePicker: React.FC<CalendarProps> = ({ field }) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value ? (
              format(field.value, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className="w-full"
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
