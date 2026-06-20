using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MesApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductType = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Created", "Description", "Name", "ProductType", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 4, 20, 24, 55, 510, DateTimeKind.Local).AddTicks(4518), "Phone product description", "Phone product", 0, 0 },
                    { 2, new DateTime(2026, 1, 5, 0, 9, 8, 510, DateTimeKind.Local).AddTicks(4518), "Tablet product description", "Tablet product", 1, 1 },
                    { 3, new DateTime(2026, 1, 4, 8, 50, 36, 510, DateTimeKind.Local).AddTicks(4518), "Smartwatch product description", "Smartwatch product", 2, 2 },
                    { 4, new DateTime(2026, 1, 1, 18, 47, 38, 510, DateTimeKind.Local).AddTicks(4518), "Earbuds product description", "Earbuds product", 3, 4 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
