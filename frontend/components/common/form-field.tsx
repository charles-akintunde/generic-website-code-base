import { Control, Controller } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { IFormField } from '../../types/componentInterfaces';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import MultiSelect from '../ui/multi-select';
import { Checkbox } from '../ui/checkbox';
import { PlateEditor } from '../plate/plate';
import { Textarea } from '../ui/textarea';

const FormField: React.FC<IFormField> = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  options = [],
  multiple = false,
  onChange,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div style={{ position: 'relative' }}>
              {(type === 'text' || type === 'password') && (
                <>
                  <Input
                    type={
                      type === 'password' && !showPassword ? 'password' : 'text'
                    }
                    autoComplete="off"
                    placeholder={placeholder}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (onChange) onChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      field.onBlur();
                      if (onBlur) onBlur(e);
                    }}
                  />
                  {type === 'password' && (
                    <div
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </div>
                  )}
                </>
              )}
              {type === 'select' && (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type === 'multiple-select' && (
                <MultiSelect
                  options={options.map((option) => ({
                    ...option,
                    value: option.value.toString(),
                  }))}
                  value={field.value.map((val: string) => ({
                    label:
                      options.find((option) => option.value.toString() === val)
                        ?.label || val,
                    value: val,
                  }))}
                  onChange={(vals) =>
                    field.onChange(vals.map((val) => val.value))
                  }
                  placeholder={placeholder}
                />
              )}
              {type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor={name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {placeholder}
                  </label>
                </div>
              )}

              {type === 'picture' && (
                <Input
                  id="picture"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      field.onChange(file);
                    }
                  }}
                />
              )}

              {type === 'document' && (
                <Input
                  id="document"
                  type="file"
                  accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      field.onChange(file);
                    }
                  }}
                />
              )}
              {type == 'textarea' && (
                <Textarea
                  className="h-48"
                  {...field}
                  placeholder={placeholder}
                />
              )}

              {type === 'rich-text-editor' && (
                <PlateEditor value={field.value} onChange={field.onChange} />
              )}
            </div>
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default FormField;
