<?php

namespace App\Entities\Elements;

class PageMessage
{
    public string $status = 'success';
    public string $message = '';
    public string $type = 'alert';

    public function status(string $status): PageMessage
    {
        $this->status = $status;

        return $this;
    }

    public function message(string $message): PageMessage
    {
        $this->message = $message;

        return $this;
    }

    public function type(string $type): PageMessage
    {
        $this->type = $type;

        return $this;
    }

    public static function success(string $message): PageMessage
    {
        return (new self())->status('success')->message($message);
    }

    public static function error(string $message): PageMessage
    {
        return (new self())->status('error')->message($message);
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'message' => $this->message,
            'type' => $this->type,
        ];
    }
}
