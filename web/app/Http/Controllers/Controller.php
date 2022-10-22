<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use DotenvEditor;
use Response;

class Controller extends BaseController
{
    use AuthorizesRequests;
    use DispatchesJobs;
    use ValidatesRequests;

    /**
     * Get credentials
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    public function getCredentials(Request $request)
    {
        return Response::json([
            'clientId' => env('AMERIA_CLIENT_ID', ''),
            'username' => env('AMERIA_USERNAME', ''),
            'password' => env('AMERIA_PASSWORD', ''),
        ]);
    }

    /**
     * Set credentials
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     */
    public function setCredentials(Request $request)
    {
        $this->validate($request, [
            'clientId' => 'required|string',
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        DotenvEditor::setKey('AMERIA_CLIENT_ID', $request->input('clientId'));
        DotenvEditor::setKey('AMERIA_USERNAME', $request->input('username'));
        DotenvEditor::setKey('AMERIA_PASSWORD', $request->input('password'));
        DotenvEditor::save();

        return Response::json([
            'clientId' => env('AMERIA_CLIENT_ID', ''),
            'username' => env('AMERIA_USERNAME', ''),
            'password' => env('AMERIA_PASSWORD', ''),
        ]);
    }
}
