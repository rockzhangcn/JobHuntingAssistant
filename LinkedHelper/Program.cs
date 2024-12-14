
using System.Text.Json; // Add this line
using System.Text; // Added for Encoding
using System;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

using System.Diagnostics;

using PdfSharp.Pdf;
using PdfSharp.Drawing;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    // options.AddPolicy("AllowOrigin",
    //     builder => builder.WithOrigins("http://localhost:3000", "http://192.168.1.234:3000")
    //                       .AllowAnyMethod()
    //                       .AllowAnyHeader()
    //                       .AllowCredentials());

                           options.AddPolicy("AllowAll", // 自定义策略名称
        builder => builder.AllowAnyOrigin() // 允许所有来源
                          .AllowAnyMethod() // 允许所有 HTTP 方法
                          .AllowAnyHeader()); // 允许所有请求头
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowOrigin");
app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapPost("/position_info",  async (HttpContext httpContext) =>
{
    using var reader = new StreamReader(httpContext.Request.Body);
    var body1 = await reader.ReadToEndAsync();
    var jsonData = JsonSerializer.Deserialize<JsonElement>(body1);
  
    var position = "None";
    var company = "null";
    var hiringNanager = "Hiring Manager";
    var city = "Auckland";
    //TODO removed after client get correct logics.
    try {
        position = jsonData.GetProperty("position").GetString();
        company = jsonData.GetProperty("company").GetString();
        hiringNanager = jsonData.GetProperty("manager").GetString();
        city = jsonData.GetProperty("city").GetString();
    } catch (KeyNotFoundException) {
        Console.WriteLine("Key Now Found in the post data");
    }

    string todayDate = DateTime.Now.ToString("MMM dd, yyyy");

    Console.WriteLine($"We get information position:\"{position}\", company:\"{company}\", name:\"{hiringNanager}\"");
    
    string inputPath = "CoverLetter_template.docx";
    string outputDocPath = "CoverLetter_fit.docx";
    
    File.Copy(inputPath, outputDocPath, true);
    using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(outputDocPath, true))
    {
        var body = wordDoc?.MainDocumentPart?.Document.Body;
        if (body == null) {
            return Results.Unauthorized();
        }
            
        foreach (var text in body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Text>())
        {
            if (text.Text.Contains("{NAME}"))
            {
                text.Text = text.Text.Replace("{NAME}", hiringNanager);
            }

            if (text.Text.Contains("{COMPANY}"))
            {
                text.Text = text.Text.Replace("{COMPANY}", company);
            }

            if (text.Text.Contains("{POSITION}"))
            {
                text.Text = text.Text.Replace("{POSITION}", position);
            }

            if (text.Text.Contains("{CITY}"))
            {
                text.Text = text.Text.Replace("{CITY}", city);
            }

            if (text.Text.Contains("{DATE}"))
            {
                text.Text = text.Text.Replace("{DATE}", todayDate);
            }
            
        }

        wordDoc?.MainDocumentPart.Document.Save();
    }

    //File.Copy(inputPath, outputDocPath, true);
    Console.WriteLine($"Modified {inputPath} saved to: {outputDocPath}");
    // 定义要执行的命令和参数
    
    string outputPdfPath = "CoverLetter_fit.pdf";

    string command = $"libreoffice --headless --convert-to pdf {outputDocPath} --outdir .";

    // 创建并配置 Process
    Process process = new Process
    {
        StartInfo = new ProcessStartInfo
        {
            FileName = "/bin/bash", // 使用 Bash Shell
            Arguments = $"-c \"{command}\"", // 使用 -c 执行命令
            RedirectStandardOutput = true, // 重定向标准输出
            RedirectStandardError = true,  // 重定向错误输出
            UseShellExecute = false,       // 禁用 Shell 执行
            CreateNoWindow = true          // 不创建窗口
        }
    };

    // 启动进程
    process.Start();

    // 读取输出和错误
    string output = process.StandardOutput.ReadToEnd();
    string error = process.StandardError.ReadToEnd();

    // 等待进程完成
    process.WaitForExit();

    // 打印结果
    Console.WriteLine($"Output:\n{output}");
    if (!string.IsNullOrEmpty(error))
        Console.WriteLine($"Error:\n{error}");


    // httpContext.Response.ContentType = "application/pdf";
    // httpContext.Response.Headers.Add("Content-Disposition", $"attachment; filename={outputPdfPath}");

    // // 返回文件
    // await  httpContext.Response.SendFileAsync(outputPdfPath);
    Console.WriteLine("Begin to download");
     // Code path below returns a value
    var fileBytes = await File.ReadAllBytesAsync(outputPdfPath);
    return Results.File(fileBytes, "application/pdf", outputPdfPath);
    // // 获取文件内容类型（MIME 类型）
    // var mimeType = "text/plain"; // 或根据需要替换为其他 MIME 类型

    // // 读取文件字节
    // var fileBytes = File.ReadAllBytes(outputDocPath);

    // // 返回文件作为响应
    // return File(fileBytes, mimeType, outputDocPath);

}).WithOpenApi();


app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
